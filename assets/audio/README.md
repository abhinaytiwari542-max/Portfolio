# Background track

`track.m4a` is an original ambient loop written for this site: a slow four-chord
pad with a sparse bell line over it, 30 seconds, crossfaded so it repeats
seamlessly. It was generated rather than sourced, so there is no licence
attached and it is safe to publish from a public repo.

## Swapping it out

The vinyl button in the header reads, in order:

1. `assets/audio/track.mp3`
2. `assets/audio/track.m4a`

Drop a file in at either name and it takes over with no code change. If none of
the candidates can play, the button hides itself rather than sitting in the
header doing nothing.

To change the tooltip text, edit `.vinylbtn__tip` in each page.

**One caveat.** This folder is served publicly and the repo is public, so
whatever sits here is distributed to every visitor. That is fine for something
you recorded, something you bought a distribution licence for, or something
released under CC0 or a Creative Commons licence. It is not fine for a
commercial single downloaded from a ripping site, regardless of how it is
named locally.
