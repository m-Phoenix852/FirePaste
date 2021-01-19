let editorLoaded = false;

const newPaste = () => {
  if (!editorLoaded) return;
  document.body.classList.add("disabled");
  document.querySelector("iframe").contentWindow.postMessage({
    type: "get",
  });
};
document.querySelector(".manageCard button").onclick = newPaste;

document.querySelector("iframe").onload = () => {
  editorLoaded = !editorLoaded;
  let pasteData = document.querySelector(".pasteData").innerHTML;
  console.log(pasteData);

  if (pasteData) {
    document.querySelector("iframe").contentWindow.postMessage({
      type: "set",
      data: pasteData,
    });
  }

  window.addEventListener("message", async (m) => {
    let req = await fetch("/paste", {
      body: m.data,
      headers: {
        "Content-Type": "text/plain",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: "POST",
    });
    let res = JSON.parse(await req.text());
    window.location.replace("/" + res.data.pasteID);
  });
};
