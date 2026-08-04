const fs = require("fs");
const path = require("path");

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      results.push(file);
    }
  });
  return results;
}

const files = walk("src").filter(
  (f) => f.endsWith(".ts") || f.endsWith(".tsx"),
);
files.forEach((file) => {
  let content = fs.readFileSync(file, "utf8");
  content = content.replace(/#006886/gi, "#1C1A16");
  content = content.replace(/#f25c23/gi, "#AF261D");
  content = content.replace(/#F15A24/gi, "#AF261D");
  content = content.replace(/bni-blue/g, "danantara-black");
  content = content.replace(/bni-orange/g, "danantara-red");
  content = content.replace(/rounded-3xl/g, "rounded-md");
  content = content.replace(/rounded-2xl/g, "rounded-md");
  content = content.replace(/rounded-xl/g, "rounded-md");
  content = content.replace(/rounded-full/g, "rounded-md");
  // Shadows
  content = content.replace(/shadow-2xl/g, "shadow-sm");
  content = content.replace(/shadow-xl/g, "shadow-sm");
  content = content.replace(/shadow-lg/g, "shadow-sm");
  // Component specific
  content = content.replace(/border-glow-bni/g, "border-glow-danantara-black");
  content = content.replace(/border-glow-orange/g, "border-glow-danantara-red");
  content = content.replace(/glow-bni/g, "glow-danantara-black");
  content = content.replace(/glow-accent/g, "glow-danantara-red");

  fs.writeFileSync(file, content, "utf8");
});
console.log("Replacements completed.");
