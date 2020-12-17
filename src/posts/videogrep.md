---
title: Using videogrep and youtube-dl to make supercuts
date: '2020-12-17'
---
Videogrep can make supercuts from videos by referencing the content and timestamps subtitle file. If you're using videos downloaded from YouTube, you're either getting auto-generated or creator-supplied subtitles. It's not immediately clear how to get this done, because it's a sort of old program, not updated frequently, and the error messages don't tell you exactly what's going wrong .

Here are some things I learned today that can help get the job done:

## Downloading from YouTube, with subs:

(definitely check out [the docs](https://github.com/ytdl-org/youtube-dl/blob/master/README.md#options) for all options)

**Option 1: Download video and subtitles with `youtube-dl`**

`youtube-dl [link to video] --write-sub`

- Example

    `youtube-dl https://www.youtube.com/watch\\?v\\=zM5WVh1ll4Y --write-sub`

This command downloads two files, with the same name but different extensions:

- a video file (.mkv or .mp4, both work for `videogrep`)
- a subtitle file (in my experience it has downloaded `.en.vtt` files)

Sometimes you won't be able to get the subtitles, and the `--write-auto-sub` flag which is supposed to grab the auto-generated subtitles/closed-captioning does not work reliably. But thankfully there are other tools that do that better.

**Option 2: Download video with `youtube-dl`,  subtitles with downsub**

[https://downsub.com/](https://downsub.com/)  **only** gets the subtitles or auto-generated subtitles from a video, not the video itself.  It worked first time I tried it, and worked fast. No reason I can see not to use it if `youtube-dl` can't manage to get the subtitles. Just remember you have to 

- re-name your file to match your video file, and
- make sure they're in the same directory before you can `videogrep`

## Optional: Downscale the video

You may not need the most high quality version of the video, check this [link](https://itectec.com/ubuntu/ubuntu-how-to-select-video-quality-from-youtube-dl/) to see ways to select video quality

1. **To select the video quality**, first use the `F` option to list the available formats, here’s an example:
`youtube-dl -F '<http://www.youtube.com/watch?v=P9pzm5b6FFY>'`
2. Then just plug in the desired format-code supplied in the list from the previous command `youtube-dl -f 22 'http://www.youtube.com/watch?v=P9pzm5b6FFY' --write-sub`

## Supercutting with Videogrep

Now you have what you need to make videogrep work. If you go into the docs, the basic command for using videogrep is:

`videogrep -i [input file] -s "[search term]" -o [output file]`

- Example

    `videogrep -i smallant-lynel.mkv -s 'bounce' -o lynel-supercut.mkv`

Two things you should know:

1. You'll notice there's no argument for the subtitle file; that's because `videogrep` looks for a file with the same exact name in the same folder as your video;
2. The output flag `-o` is optional; if omitted, it will just output a supercut.mp4

One gotcha that I missed was that if you're using a  .vtt file, as you probably will be from youtube, you have to pass in the flag -vtt at the end. 

Here's an example of a command I used that worked:

`videogrep -i smallant-lynel.mkv --search 'bounce' -vtt`

## Results

<iframe src="https://www.youtube.com/embed/35jyeKx0WSA" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

The results.. well the results are pretty good. Totally worth an afternoon smoothing out some of the kinks.