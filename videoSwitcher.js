/* bandwidthSwitcher / videoSwitcher by DrSnuggles
	I will just do 3 steps here

	- 10Mbps	(1080)
	- 5-10Mbps	(720)
	- <5Mbps	(576)

	Maybe i will inspect if FLAC,OPUS,AV1,h265,VP9 can be used
	actually h264+AAC for most compatibility
	^^ then it's a video switcher without HLS ;)

	264_AAC_0.mp4 is default and needed = most compatible and fast preview picture, low network consumption when not started
	0, 5 and 10 is recommended

	Twitch does:
		-  HLS    = H264+AAC
		-  160 	  =  180kbps
		-  360    =  600kbps
		-  480    = 1200kbps
		-  720@30 = 3000kbps
		-  720@60 = 4500kbps
		- 1080@30 = 4500kbps
		- 1080@60 = 6000kbps

*/

import { detectBrowserFormats } from './detectBrowserFormats.js'
import { detectHostedFiles } from './detectHostedFiles.js'

//
// Consts
//
const con = navigator.connection || navigator.mozConnection || navigator.webkitConnetion,
browserFormats = detectBrowserFormats()

//
// Vars
//
let vids = [],	// Input videos
txt = false,	// Output txt
hostedFiles = []// URLs of hosted files

const bws = {
	init: (vidOut, txtOut) => {
		txt = txtOut	// not really cool here in vid area
		if (txt) txt.innerText = Math.round(con.downlink)

		vids.push(vidOut)
		detectHostedFiles(vidOut, browserFormats, hostedFiles)
		vidOut.onplay = bws.pickVideo
	},
	doChanged: () => {
		if (txt) txt.innerText = Math.round(con.downlink)
		// test if some of our vids are running
		for (let i = 0; i < vids.length; i++) {
			if (vids[i].currentTime > 0 && !vids[i].paused && !vids[i].ended && vids[i].readyState > 2) bws.pickVideo()
		}
	},
	pickVideo: () => {
		for (let i = 0; i < vids.length; i++) {
			if (!(!vids[i].paused && !vids[i].ended && vids[i].readyState > 2)) continue	//not running

			const fullPath = vids[i].src.split('/'),
			old = fullPath[fullPath.length-1],
			maxBps = Math.round(con.downlink)
	
			let fN, currentTime
	
			for (let mbps = maxBps; mbps > -1; mbps--) {
				for (let vk = 0; vk < browserFormats.video.length; vk++) {
					for (let aud = 0; aud < browserFormats.audio.length; aud++) {
						for (let cont = 0; cont < browserFormats.container.length; cont++) {
							fN = browserFormats.video[vk] +'_'+ browserFormats.audio[aud] +'_'+ mbps +'.'+ browserFormats.container[cont].toLowerCase()
							const url = fullPath.join('/').replace(old, fN)
							if (vids[i].src === url) return // already the one we wanted
							if (hostedFiles.indexOf(url) === -1) continue
							vids[i].pause()
							currentTime = vids[i].currentTime
	
							vids[i].src = url
							vids[i].currentTime = currentTime	// ?? needs to be delayed ??
							vids[i].play()
							return
							
						}
					}
				}
			}
		}
	},
}

// attach event
con.onchange = bws.doChanged

export {bws as videoSwitcher}