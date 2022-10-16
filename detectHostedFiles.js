/*
	Check which formats are hosted on server
*/

export function detectHostedFiles(vid, browserFormats, destArr) {

	const tstVideo = document.createElement('video'),
	fullPath = vid.src.split('/'),
	old = fullPath[fullPath.length-1],
	allowed = {
		container: ['MP4'],
		video: ['AV1', 'H264'],
		audio: ['OPUS', 'AAC'],
	}

	let url

	for (let mbps = 10; mbps > -1; mbps--) {
		for (let vid = 0; vid < browserFormats.video.length; vid++) {
			if (allowed.video.indexOf(browserFormats.video[vid]) === -1) continue // i make use of AV1 + H264
			for (let aud = 0; aud < browserFormats.audio.length; aud++) {
				if (allowed.audio.indexOf(browserFormats.audio[aud]) === -1) continue // i only use OPUS + AAC
				for (let cont = 0; cont < browserFormats.container.length; cont++) {
					if (allowed.container.indexOf(browserFormats.container[cont]) === -1) continue // i only use MP4
					url = browserFormats.video[vid] +'_'+ browserFormats.audio[aud] +'_'+ mbps +'.'+ browserFormats.container[cont].toLowerCase()
					url = fullPath.join('/').replace(old, url)
					checkResource(url)
				}
			}
		}
	}

	function checkResource(url) {
		//console.log('checkResource: ', url)
		const controller = new AbortController()
		const signal = controller.signal

		fetch(url, { signal })
		.then(r => {
			if (r.status >= 200 && r.status < 400) {
				destArr.push(url)
				controller.abort()
			}
		})
	}
}
