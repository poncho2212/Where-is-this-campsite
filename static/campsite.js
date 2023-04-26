// データの初期表示
fetch("/address").then(response => {
    console.log(response);
    response.json().then((data) => {
        console.log(data);  // 取得されたレスポンスデータをデバッグ表示
        // データを表示させる
        const tableBody = document.querySelector("#address-list > tbody");
        data.forEach(elm => {
            // 1行づつ処理を行う
            let tr = document.createElement('tr');
            // first name
            let td = document.createElement('td');
            td.innerText = elm.first_name;
            tr.appendChild(td);
            // last name
            td = document.createElement('td');
            td.innerText = elm.last_name;
            tr.appendChild(td);
            // email
            td = document.createElement('td');
            td.innerText = elm.email;
            tr.appendChild(td);

            // 1行分をtableタグ内のtbodyへ追加する
            tableBody.appendChild(tr);
        });
    });
});

// データ表示の関数
const show_data = (data) => {
    // データを表示させる
    const tableBody = document.querySelector("#address-list > tbody")
    tableBody.innerHTML = ""

    // レスポンスのJSONデータの件数が0だった場合
    if (data && data.length == 0) {
        let tr = document.createElement('tr')
        tr.innerHTML = "表示するデータがありません。"
        tableBody.appendChild(tr)
        return
    }

    data.forEach(elm => {
        let tr = document.createElement('tr')
        // first name
        let td = document.createElement('td')
        td.textContent = elm.first_name
        tr.appendChild(td)
        // last name
        td = document.createElement('td')
        td.textContent = elm.last_name
        tr.appendChild(td)
        // email
        td = document.createElement('td')
        td.textContent = elm.email
        tr.appendChild(td)

        // 1行分をtableタグ内のtbodyへ追加する
        tableBody.appendChild(tr)
    })
}


// <button id="search-submit">Search</button>
const sb = document.querySelector("#search-submit")
sb.addEventListener("click", (ev) => {
    ev.preventDefault()     //HTMLが本来持っている他の正常なボタン処理を無かったことにする
    // console.log("検索ボタンが押されたよ")

    // クエリパラメータにて、以下の項目を指定できます。
    //fn: 指定されたキーワードがFirst Nameに含まれるデータを返します。省略時全件。
    //ln: 指定されたキーワードがLast Nameに含まれるデータを返します。省略時全件。
    //em: 指定されたキーワードがEmailに含まれるデータを返します。省略時全件。

    // パラメーターの取得
    //  <input type="text" id="search-firstname" placeholder="First name" name="fn">
    const fn = document.querySelector("#search-firstname").value
    // <input type="text" id="search-lastname" placeholder="Last name" name="ln">
    const ln = document.querySelector("#search-lastname").value
    // <input type="text" id="search-email" placeholder="Email address" name="em">
    const em = document.querySelector("#search-email").value

    const param = new URLSearchParams()
    if (fn !=="") param.append("fn", fn)    //ifはなくてもOK
    if (ln !=="") param.append("ln", ln)
    if (em !=="") param.append("em", em)

    console.log(param.toString())

    // データ検索のWeb APIは/addressをGETメソッドで呼び出す
    fetch("/address?" + param.toString()).then(response => {
        console.log(response);
        response.json().then((data) => {
            console.log(data);  // 取得されたレスポンスデータをデバッグ表示
            // データを表示させる
            show_data(data)
        });
    });
})

// <button id="add-submit">Add</button>
const ab = document.querySelector("#add-submit")
ab.addEventListener("click", (ev) => {
    ev.preventDefault()     //HTMLが本来持っている他の正常なボタン処理を無かったことにする

    // パラメーターの取得
    //  <input required type="text" id="add-firstname" placeholder="First name" name="fn">
    const fn = document.querySelector("#add-firstname").value
    // <input required type="text" id="add-lastname" placeholder="Last name" name="ln">
    const ln = document.querySelector("#add-lastname").value
    // <input required type="text" id="add-email" placeholder="Email address" name="em">
    const em = document.querySelector("#add-email").value

    // 未入力時のメッセージ
    let error_message = ""
    if (!fn && fn === "") error_message += "first nameが未入力です。<br>"
    if (!ln && ln === "") error_message += "last nameが未入力です。<br>"
    if (!em && em === "") error_message += "emailが未入力です。<br>"

    // エラーメッセージがあるかどうかでエラーの表示有無を決定
    if (error_message !== "") {
        document.getElementById('error-container').innerHTML = error_message
        document.getElementById('error-container').style.display = "block"
        return
    } else {
        document.getElementById('error-container').innerHTML = ""
        document.getElementById('error-container').style.display = "none"
    }

    // データ送信
    let data = new FormData(document.getElementById('add'))

    fetch('/address', {method: 'POST', body: data,}) // dataには送りたいデータが入っているものとする
        .then(function (response) {
            console.log(response);
            // 入力項目の初期化
            document.getElementById("add").reset()

            // エラーの表示領域を初期化
            document.getElementById('error-container').innerHTML = ""
            document.getElementById('error-container').style.display = "none"
            // 登録メッセージ等の表示領域を初期化
            document.getElementById('message-container').innerHTML = ""
            document.getElementById('message-container').style.display = "none"

            response.json().then((data) => {
                console.log(data);  // 取得されたレスポンスデータをデバッグ表示
                if (data.error) {
                    // エラーの受信
                    document.getElementById('error-container').innerHTML = data.error
                    document.getElementById('error-container').style.display = "block"
                }

                if (data.result) {
                    // メッセージの受信
                    document.getElementById('message-container').innerHTML = data.result
                    document.getElementById('message-container').style.display = "block"

                    if (data.json_data) {
                        // データを表示させる
                        show_data(data.json_data)
                    }
                }
            });

        })
})