/*
	https://davidwalsh.name/detect-supported-video-formats-javascript
	https://privacycheck.sec.lrz.de/active/fp_cpt/fp_can_play_type.html
	https://jyavenard.github.io/htmltests/tests/canPlayType.html

	MediaSource.isTypeSupported is for creating SourceBuffer
	MediaSource.canPlayType is just for playing back

	problem is that sometimes its reported as OK in another container
	"probably", "maybe", ""
	thats all crazy, like everytime with detection ;)
	
	container: MP4, MKV, WEBM
	video: AV1, 265, VP9, 264
	audio: FLAC, OPUS, AAC
*/

export function detectBrowserFormats() {

	const formats = {	// returned
		container: [],
		audio: [],
		video: []
	}

	const tstVideo = document.createElement('video')

	const tst = {
		containers: {
			MP4: 'mp4',		// most accepted and i prefer this as single container
			WEBM: 'webm',	// but wanted to test the others
			OGG: 'ogg',		// MKV works in my case but its OGGish container
			MKV: 'x-matroska',
		},
		video: {			// audio and video sorted by quality
			AV1: 'av01.0.08M.08',	// av01.0.08M.08 = AV1, Main Profile, Level 4.0 Main Tier, 8-bit
			H265: 'hvc1.1.6.L93',	// hvc1.1.6.L93.B0 = HEVC (HVC) progressive, non-packed stream, Main Profile, Main Tier, Level 3.1
			VP9: 'vp9',				// vp09.00.10.08 = VP9, Profile 0, Level 1, 8-bit
			H264: 'avc1',			// BaseLine1 = avc1.42000A; High10L5.1 = avc1.6E0033
		},
		audio: {
			FLAC: 'flac',
			OPUS: 'opus',
			AAC: 'mp4a.40', // mp4a.40.2 = MPEG-4 AAC-LC
		},
	}

	for(let i = 0, ik = Object.keys(tst.video); i < ik.length; i++) {
		for(let c = 0, ck = Object.keys(tst.containers); c < ck.length; c++) {
			testSingleCodec('video', ck[c], ik[i])
		}
	}
	for(let i = 0, ik = Object.keys(tst.audio); i < ik.length; i++) {
		for(let c = 0, ck = Object.keys(tst.containers); c < ck.length; c++) {
			testSingleCodec('audio', ck[c], ik[i])
		}
	}

	function testSingleCodec(typ, cont, codec) {
		const tstType = typ +'/'+ tst.containers[cont] +'; codecs="'+ tst[typ][codec] +'"'
		const chk = tstVideo.canPlayType(tstType)
		//console.log(typ, cont, codec, tstType, chk)
		if (chk) {
			if (formats.container.indexOf(cont) === -1) formats.container.push(cont)
			if (formats[typ].indexOf(codec) === -1) formats[typ].push(codec)
		}
	}

	return formats
}
