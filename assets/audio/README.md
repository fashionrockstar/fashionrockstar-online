# SYSTEM ACCESS audio

`FASHIONROCKSTAR_ACCESS_GRANTED.mp3` is the ten-second entry excerpt of the owner-supplied
`FASHIONROCKSTAR_ACCESS_GRANTED.wav` received on September 22, 2026.

- Source: 44.1 kHz, stereo, 24-bit PCM; 39,096,732 bytes.
- Web excerpt: MP3, 44.1 kHz, mono, 160 kbps; 201,186 bytes; exactly 10 seconds.
- The first ten seconds retain the supplied speech, pace and gain. The interface fades the final black beat before HOME. No generated or replacement speech is used.
- Full recording duration: 147.757483 seconds. A complete MP3 conversion is preserved outside the site in `system-access-review/FASHIONROCKSTAR_ACCESS_GRANTED-full.mp3` in the development workspace.
- The original WAV remains unchanged in the owner's Downloads folder.
- The intro starts playback only after INITIALIZE, and stops it on completion or SKIP.

Encoded with FFmpeg 9.0.2 / libmp3lame:

```sh
ffmpeg -nostdin -hide_banner -n -i FASHIONROCKSTAR_ACCESS_GRANTED.wav -t 10 -map_metadata -1 -vn -ac 1 -ar 44100 -c:a libmp3lame -b:a 160k -write_xing 1 FASHIONROCKSTAR_ACCESS_GRANTED.mp3
```

FFprobe confirmed format and duration. A complete decode finished without errors.

SHA-256:

```text
WAV  dfcd8c68e8dc52d47cefd47494bad71be51de24113289afa02585075d2ee15b4
MP3  07456c8eb38d57dd8d04af77abca9066f3685d2c0026146fc9c7290f3256acf2
```

Portable encoding tools are kept outside the site under the workspace's
`tooling/ffmpeg` folder; they are not website dependencies. The FFmpeg build was
downloaded from [Gyan's Windows builds](https://www.gyan.dev/ffmpeg/builds/), as
linked by [FFmpeg](https://ffmpeg.org/download.html), and verified against its
published SHA-256 (`4705843ccaaf54257c16ad90f3e952ece33c17df964ecf7bfdbb0f49c7171077`).
