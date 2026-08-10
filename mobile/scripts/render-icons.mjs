/* Renders every raster icon the two stores want from store/icon-source.svg, so
   the art stays in one file. Chrome does the rasterising — it is the same engine
   the game runs in, and it is already on any machine that can test this app.
   ImageMagick only flattens the alpha channel afterwards, which Apple requires.

   The crop is the interesting part. icon-source.svg is the Android adaptive
   canvas: 108 units wide, of which a launcher shows the middle 72 and masks
   within the middle 66. iOS has no such margin — the system rounds the corners
   of the full square — so an iOS icon rendered from the whole 108 canvas would
   sit in the middle of its own tile looking shrunken. Cropping the viewBox to
   the middle 76 puts the ring tips at 80% of the half-width, which is about
   where a hand-drawn iOS icon would put them, and well clear of the corner
   radius (22.37% of the edge). The background gradient is a full-bleed rect in
   source units, so a crop keeps it continuous rather than rescaling it.

   Usage: node scripts/render-icons.mjs */
import {execFileSync} from "node:child_process";
import {mkdtempSync, readFileSync, writeFileSync, rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join, dirname} from "node:path";
import {fileURLToPath} from "node:url";

const here=dirname(fileURLToPath(import.meta.url));
const root=join(here,"..");
const CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const src=readFileSync(join(root,"store/icon-source.svg"),"utf8");

/* dest, pixels, viewBox — the source's own box is "0 0 108 108" */
const JOBS=[
  ["ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png",1024,"16 16 76 76"],
  ["store/icon-512.png",512,"0 0 108 108"],
];

const tmp=mkdtempSync(join(tmpdir(),"pe-icons-"));
try{
  for(const [dest,px,box] of JOBS){
    const svg=src.replace(/viewBox="[^"]*"/,`viewBox="${box}"`)
                 .replace(/width="\d+"/,`width="${px}"`).replace(/height="\d+"/,`height="${px}"`);
    /* an <img> rather than inline SVG: the page then has no layout of its own to
       leak white pixels round the edge of a screenshot */
    writeFileSync(join(tmp,"icon.svg"),svg);
    writeFileSync(join(tmp,"page.html"),
      `<style>html,body{margin:0;background:#000}img{display:block}</style><img src="icon.svg" width="${px}" height="${px}">`);
    execFileSync(CHROME,["--headless","--disable-gpu","--hide-scrollbars",
      `--screenshot=${join(tmp,"shot.png")}`,`--window-size=${px},${px}`,join(tmp,"page.html")],{stdio:"ignore"});
    /* Apple rejects an app icon that carries an alpha channel at all, even one
       that is opaque everywhere, and Chrome always writes RGBA */
    execFileSync("magick",[join(tmp,"shot.png"),"-background","black","-alpha","remove","-alpha","off",
      "-strip",join(root,dest)]);
    console.log(`${dest}  ${px}×${px}  viewBox ${box}`);
  }
}finally{ rmSync(tmp,{recursive:true,force:true}); }
