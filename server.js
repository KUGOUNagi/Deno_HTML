import { serve } from "https://deno.land/std@0.138.0/http/server.ts";

import { serveDir } from "https://deno.land/std@0.138.0/http/file_server.ts";


let previousWord = "しりとり";
let wordFile= ['ろしあ','かい','うもう','うえ','かお'];
let myArray=[];
let regexp = /^[\u{3000}-\u{301C}\u{3041}-\u{3093}\u{309B}-\u{309E}\u{30FC}]+$/mu;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

console.log("Listening on http://localhost:8000");

serve(async (req) => {

  const pathname = new URL(req.url).pathname;


  if (req.method === "GET" && pathname === "/shiritori") {

    previousWord=wordFile[getRandomInt(0,5)];

    return new Response(previousWord);

  }

  if (req.method === "POST" && pathname === "/shiritori") {

    const requestJson = await req.json();

    const nextWord = requestJson.nextWord;

    if (

      nextWord.length > 0 &&

      previousWord.charAt(previousWord.length - 1) !== nextWord.charAt(0)

    ) {

      return new Response("前の単語に続いていません。", { status: 400 });

    }
    if (

      nextWord.length > 0 &&

      myArray.indexOf(nextWord) !== -1

    ) {

      return new Response("同じ単語を使っています。", { status: 400 });

    }
    if (

      nextWord.length > 0 &&

      nextWord.charAt(nextWord.length - 1) == 'ん'

    ) {

      return new Response("「ん」と言いました。あなたの負けです。", { status: 400 });

    }
    if (

      nextWord.length > 0 &&

      regexp.test(nextWord) !==true

    ) {

      return new Response("ひらがな以外が混ざっています。", { status: 400 });

    }


    previousWord = nextWord;
    myArray.push(previousWord);

    return new Response(previousWord);

  }


  return serveDir(req, {

    fsRoot: "public",

    urlRoot: "",

    showDirListing: true,

    enableCors: true,

  });

});

