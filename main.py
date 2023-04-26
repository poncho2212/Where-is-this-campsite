from flask import Flask, request, render_template, jsonify
import json  # Python標準のJSONライブラリを読み込んで、データの保存等に使用する

app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False  # 日本語などのASCII以外の文字列を返したい場合は、こちらを設定しておく


# http://127.0.0.1:5000/address
@app.route('/address', methods=["GET"])
def address_get():

    # 検索パラメータの取得
    p_first_name = request.args.get('fn', None)
    p_last_name = request.args.get('ln', None)
    p_email = request.args.get('em', None)

    with open('campsite.json') as f:
        json_data = json.load(f)    # json_data = pythonの辞書型

    # パラメータにより返すデータをフィルタリングする
    if p_first_name is not None:
        json_data = list(filter(lambda item: p_first_name.lower() in item["first_name"].lower(), json_data))
    if p_last_name is not None:
        json_data = list(filter(lambda item: p_last_name.lower() in item["last_name"].lower(), json_data))
    if p_email is not None:
        json_data = list(filter(lambda item: p_email.lower() in item["email"].lower(), json_data))

    return jsonify(json_data)

@app.route('/address', methods=["POST"])
def address_post():
    # 検索パラメータの取得
    p_first_name = request.form.get('fn', None)
    p_last_name = request.form.get('ln', None)
    p_email = request.form.get('em', None)

    with open('campsite.json') as f:
        json_data = json.load(f)    # json_data = pythonの辞書型

    # パラメーターが全て入力されているかをチェックしてメッセージ
    message = ""
    error = ""
    if p_first_name is None:
        error += "first nameが未入力です。\n"
    if p_last_name is None:
        error +=  "last nameが未入力です。\n"
    if p_email is None:
        error +=  "emailが未入力です。\n"
    if p_first_name and p_last_name and p_email:
        message = "登録完了"

    # メッセージなども含めてデータを送信
    ret = {
        "json_data": json_data, 
        "result": message,
        "error": error
    }

    # データを追加してファイルに書き込み
    add_data = {"email": p_email, "first_name": p_first_name, "last_name": p_last_name}
    json_data.append(add_data)

    with(open('campsite.json','w')) as f:
        json.dump(json_data, f, indent=4, ensure_ascii=False)

    return jsonify(ret)

# http://127.0.0.1:5000/
@app.route('/')
def index():
    return render_template("campsite.html")


if __name__ == "__main__":
    # debugモードが不要の場合は、debug=Trueを消してください
    app.run(debug=True)