// 分享链接路径
const SharePath = '/d/';
// 分享ID长度，建议10-200位内
const ID_Length = 12;

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);

  if (request.method === 'POST' && url.pathname === '/submit') {
    return await createDocument(request);
  } else if (request.method === 'GET' && url.pathname.startsWith(SharePath)) {
    return await getDocument(url.pathname.replace(SharePath, ''));
  } else if (request.method === 'GET' && url.pathname === '/') {
    return new Response(renderHTML(), {
      headers: { 'Content-Type': 'text/html; charset=UTF-8' }
    });
  } else {
    return new Response('404', {
      status: 302,
      headers: {
        'Content-Type': 'text/plain; charset=UTF-8',
        'Location': '/'
      }
    });
  }
}

async function createDocument(request) {
  try {
    const { text_doc } = await request.json();
    const id = generateId();
    const data = { text_doc };
    await Worker_Secret_doc.put(id, JSON.stringify(data));
    const link = `${new URL(request.url).origin}${SharePath}${id}`;
    return new Response(JSON.stringify({ link }), {
      headers: { 'Content-Type': 'application/json; charset=UTF-8' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: '创建文档失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=UTF-8' }
    });
  }
}

function generateId(length = ID_Length) {
  const charset = "ABCDEFGHJKMNPQRSTWXYZ-abcdefghjkmnpqrstwxyz_23456789";    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  let idString = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    idString += charset[randomIndex];
  }
  return idString;
}

async function getDocument(id) {
  try {
    const value = await Worker_Secret_doc.get(id);

    if (!value) {
      return new Response('文档不存在。', {
        status: 404,
        headers: { 'Content-Type': 'text/plain; charset=UTF-8' }
      });
    }

    const data = JSON.parse(value);
    await Worker_Secret_doc.delete(id);
    const htmlContent = renderShareHTML(data.text_doc);
    return new Response(htmlContent, {
      headers: { 'Content-Type': 'text/html; charset=UTF-8' }
    });
  } catch (error) {
    return new Response('未能获取文档。', {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=UTF-8' }
    });
  }
}

function renderHTML() {
  return `
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>秘密文档</title>
    <link rel="icon" type="image/png" href="data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAQAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPa3/ED6m/1NAnP9VQZH/VUOG/1VEff9ITnr1AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADy0/5s+q///P6D//0GV//9Civ//RID//5KCsIL0kE9V/pNHVf6UR1X+lEdV/pNHRv2SRgEAAAAAAAAAAAAAAAA7u/+pPbL//zCR5v8aZ7//PYz3/0OG//+7hoX//ZJI//6USP/+lEj//pRI//6USP/+k0dFAAAAAAAAAAAAAAAAOsL/qTy5//8ZcsD/AEaU/y+C4v9Cjf//uoiG//2TSP/+lEj//pRI//6USP/+lEj//pRHVQAAAAAAAAAAAAAAADnJ/6k7wP//Oa/4/y6R4/8/n/7/QZT//7mNh//8mUv//ppL//6aSv/+mUr//phK//6YSVUAAAAAAAAAAAAAAAA4zf5zOsf//Du8//89sf//Pqb//0qc9f/am23//aFO//6hTv/+oE7//qBN//6fTf/+nk1VAAAAAAAAAAAAAAAAAAAAAFfB4lmKsrT/8JVT/1ep5v/7pVL//alS//6oUf/+qFH//qdR//6mUf/+plD//qVQVQAAAAAAAAAAAAAAAAAAAADHsYBUb7/P/1S55/+jsqT//bBV//6wVf/9r1X//a1U//2sVP/9rFT//axT//2rU1UAAAAAAAAAAAAAAAAAAAAA+bhdU/65Wf/+uFn//rhZ//63Wf/+tlj/+7FX//mrVv/4p1b/96dV//mpVv/6q1VWAAAAAAAAAAAAAAAAAAAAAP7AXVP/wF3//8Bc//+/XP//vlz//btb//mwWf/1p1j/86FX//KfVv/zoFb/9qteVgAAAAAAAAAAAAAAAAAAAAD/x2BT/8dg///GYP//xl///8Vf//y+Xv/4uWn//tyt//7hsf/95K3/++WmxffIhQ0AAAAAAAAAAAAAAAAAAAAA/85jU//OY///zWP//81j///MYv/8xGH/+cR5//3jrv/85qr/++mmxfvopw0AAAAAAAAAAAAAAAAAAAAAAAAAAP/VZlP/1Wb//9Rm///UZv//02b//c1k//nLef/76af/+uyjxfrqow0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/22lR/9xq///baf//2mn//9pp//7XaP/51Xn/+e6gxfntoQ0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/95rD//fa5n/32up/99rqf7fa6n+3mup+914mvnokw0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgP8AAIADAACAAwAAgAMAAIADAACAAwAAwAMAAMADAADAAwAAwAMAAMADAADABwAAwA8AAMAfAADAPwAA//8AAA==">
    <style>
    body {
        font-family: Arial, sans-serif;
        line-height: 1.5;
        padding: 20px;
        box-sizing: border-box;
        font-size: 16px;
    }
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        max-width: 600px;
        margin: 0 auto;
    }
    #editor {
        width: 100%;
        height: 300px;
        margin-bottom: 15px;
    }
    #submit-button {
        width: 100%;
        padding: 10px;
        margin-bottom: 15px;
    }
    #link {
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
    }
    textarea {
        width: 100%;
        height: 100%;
        padding: 10px;
        box-sizing: border-box;
        border: 1px solid #ccc;
    }
    @media (max-width: 600px) {
        body {
            padding: 10px;
            font-size: 14px;
        }
        #editor {
            height: 200px;
            margin-bottom: 10px;
        }
        #submit-button {
            margin-bottom: 10px;
        }
    }
    </style>
</head>
<body>
    <h1>㊙️密文档</h1>
    <p>无服务器、无数据库、阅后即焚、保障隐私</p>
    <div id="editor">
        <textarea placeholder="在此输入"></textarea>
    </div>
    <button id="submit-button">创建链接🔗</button><br><br>
    <div id="link"></div><br>
    <footer>
      <p></p>
    </footer>
    <script>
    document.getElementById('submit-button').addEventListener('click', function() {
        var content = document.querySelector('textarea').value;
        fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text_doc: content }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.link) {
                var linkDiv = document.getElementById('link');
                linkDiv.innerHTML = '<strong>链接已生成</strong>  <a href="' + data.link + '" target="_blank" id="generated-link">' + data.link + '</a>';

                // 添加点击事件，复制到剪切板
                var generatedLink = document.getElementById('generated-link');
                generatedLink.addEventListener('click', function(event) {
                    event.preventDefault(); // 阻止默认行为

                    // 创建临时输入框来复制文本
                    var tempInput = document.createElement('input');
                    tempInput.value = data.link;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);

                    alert('链接已复制到剪切板: ' + data.link);
                });
            } else {
                alert('创建链接出错');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('创建链接出错');
        });
    });
    </script>
</body>
</html>
      `;
}

function renderShareHTML(text_doc) {
  return `
  <!DOCTYPE html>
  <html lang="zh">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>秘密文档</title>
      <link rel="icon" type="image/png" href="data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAQAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPa3/ED6m/1NAnP9VQZH/VUOG/1VEff9ITnr1AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADy0/5s+q///P6D//0GV//9Civ//RID//5KCsIL0kE9V/pNHVf6UR1X+lEdV/pNHRv2SRgEAAAAAAAAAAAAAAAA7u/+pPbL//zCR5v8aZ7//PYz3/0OG//+7hoX//ZJI//6USP/+lEj//pRI//6USP/+k0dFAAAAAAAAAAAAAAAAOsL/qTy5//8ZcsD/AEaU/y+C4v9Cjf//uoiG//2TSP/+lEj//pRI//6USP/+lEj//pRHVQAAAAAAAAAAAAAAADnJ/6k7wP//Oa/4/y6R4/8/n/7/QZT//7mNh//8mUv//ppL//6aSv/+mUr//phK//6YSVUAAAAAAAAAAAAAAAA4zf5zOsf//Du8//89sf//Pqb//0qc9f/am23//aFO//6hTv/+oE7//qBN//6fTf/+nk1VAAAAAAAAAAAAAAAAAAAAAFfB4lmKsrT/8JVT/1ep5v/7pVL//alS//6oUf/+qFH//qdR//6mUf/+plD//qVQVQAAAAAAAAAAAAAAAAAAAADHsYBUb7/P/1S55/+jsqT//bBV//6wVf/9r1X//a1U//2sVP/9rFT//axT//2rU1UAAAAAAAAAAAAAAAAAAAAA+bhdU/65Wf/+uFn//rhZ//63Wf/+tlj/+7FX//mrVv/4p1b/96dV//mpVv/6q1VWAAAAAAAAAAAAAAAAAAAAAP7AXVP/wF3//8Bc//+/XP//vlz//btb//mwWf/1p1j/86FX//KfVv/zoFb/9qteVgAAAAAAAAAAAAAAAAAAAAD/x2BT/8dg///GYP//xl///8Vf//y+Xv/4uWn//tyt//7hsf/95K3/++WmxffIhQ0AAAAAAAAAAAAAAAAAAAAA/85jU//OY///zWP//81j///MYv/8xGH/+cR5//3jrv/85qr/++mmxfvopw0AAAAAAAAAAAAAAAAAAAAAAAAAAP/VZlP/1Wb//9Rm///UZv//02b//c1k//nLef/76af/+uyjxfrqow0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/22lR/9xq///baf//2mn//9pp//7XaP/51Xn/+e6gxfntoQ0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/95rD//fa5n/32up/99rqf7fa6n+3mup+914mvnokw0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgP8AAIADAACAAwAAgAMAAIADAACAAwAAwAMAAMADAADAAwAAwAMAAMADAADABwAAwA8AAMAfAADAPwAA//8AAA==">
      <style>
          body {
              font-family: Arial, sans-serif;
              line-height: 1.5;
              margin: 0;
              padding: 20px;
              box-sizing: border-box;
          }
          pre {
              white-space: pre-wrap;
              word-wrap: break-word;
              background: #f4f4f4;
              padding: 15px;
              border-radius: 5px;
              border: 1px solid #ccc;
              font-size: 1rem;
          }
          @media (max-width: 600px) {
              body {
                  padding: 10px;
              }
              pre {
                  font-size: 0.9rem;
              }
          }
          @media (min-width: 601px) {
              pre {
                  font-size: 1.2rem;
              }
          }
      </style>
      <script>
          window.onload = function() {
              var text_doc = ${JSON.stringify(text_doc)};
              setTimeout(function() {
                  var preElement = document.querySelector('pre');
                  preElement.textContent = text_doc;
              }, 3000);
          };
      </script>
  </head>
  <body>
      <pre><span style="color: #0000ff; font-size: 1.5rem;"><strong>3秒后显示㊙️密内容</strong></span></pre>
  </body>
  </html>  
  `;
}
