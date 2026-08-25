# Background track

`track.m4a` is an original instrumental written for this site: a 45-second
chill electronic loop at 84 BPM with synthesised drums, bass, electric-piano
chords and a sparse pentatonic melody. Everything in it is generated from
scratch here, so there is no licence attached and it is safe to serve from a
public repo.

It is crossfaded at the seam, so it repeats without an audible click.

## Swapping it out

The vinyl button in the header reads, in order:

1. `assets/audio/track.m4a`  (shipped, loads first so the console stays clean)
2. `assets/audio/track.mp3`  (fallback)

To use your own track, replace `track.m4a`. If your file is an mp3, drop it in as
`track.mp3` and swap the two entries in the `data-src` attribute on `.vinylbtn`
so the mp3 is read first, otherwise the m4a wins and the mp3 is never reached. If none of
the candidates can play, the button hides itself rather than sitting in the
header doing nothing.

To change the tooltip text, edit `.vinylbtn__tip` in each page.

**One caveat.** This folder is served publicly and the repo is public, so
whatever sits here is distributed to every visitor. That is fine for something
you recorded yourself, something you bought a distribution licence for, or
something released under CC0 or Creative Commons. It is not fine for a
commercial track pulled through a download converter, however it is named or
packaged locally.
