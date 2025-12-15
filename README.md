# 🧩 GBS Stage 2: Application Kernel Template

> **The User Application Layer for GAS Boot System (GBS)**

このリポジトリは、**GBS (GAS Boot System)** アーキテクチャにおける **Stage 2 (User Application)** のリファレンス実装（テンプレート）です。
「堅牢な設計」「モダンな開発体験」「単体起動」を両立する、GBSアプリケーション開発の標準規格を提供します。

---

## ✨ Key Features (特徴)

### 1. 🧠 Kernel Class Design (構成と委譲)
従来の `doGet` にロジックを詰め込むスタイルを廃止し、クラスベースの設計を採用しています。
`DemoOS.js` (Kernel) はアプリケーションの構成定義に徹し、実際の起動・描画・通信処理はすべてシステム層 (`AppCore`) へ委譲します。

### 2. 🎨 Strict Separation of Concerns (責務の分離)
UIとロジックを物理的に分離することで、可読性と保守性を最大化しています。
* **View (`index.html`):** 純粋なHTML/CSSのみ。ロジックは一切含みません。
* **ViewModel (`lib_DemoCore.html`):** クライアントサイドの全ロジックを集約。変数名の命名規則により品質を担保します。
* **Server Logic (`Logic.js`):** RPCで呼び出される純粋な関数群。HTTPリクエストを意識する必要はありません。

### 3. 🔌 Hybrid Boot Mechanism (単体起動と統合)
本番環境ではシステムの一部として動作し、開発時は単体アプリとして起動する「ハイブリッドブート」を実現しています。
同梱された `BIOS.js` が環境を自動判定するため、`clasp push` 後に「デプロイをテスト」するだけで即座に動作確認が可能です。

### 4. ⚡ Modern RPC Style (Async/Await)
`google.script.run` のコールバック地獄は過去のものです。
GBSのRPCプロキシにより、サーバー呼び出しを `await` を用いた同期的な記述で実装できます。

```javascript
// GBS Style: Clean & Sync
const data = await google.script.run.sync().getData();
console.log(data);
```

### 5. 💉 Dependency Injection (`BIOS_exports`)

`Logic.js` 内のサーバーサイド関数は、GASの標準サービス（`PropertiesService`など）を直接呼び出すのではなく、**`BIOS_exports`** オブジェクトを経由して利用します。

- **仕組み:** `BIOS.js` (または Stage 1) で定義されたサービスが、起動時に Kernel を通じて `BIOS_exports` グローバル変数に注入されます。
    
- **メリット:** 環境（本番/開発/テスト）に応じて、注入するインスタンスを差し替えること（モック化など）が可能になり、テスタビリティが向上します。
    

```js
// Logic.js: 注入されたサービスを利用
function getInitialData() {
  // PropertiesServiceを直接使わず BIOS_exports 経由で呼ぶ
  return BIOS_exports.ScriptProperties.getProperty('KEY');
}
```

### 6. 🤝 Library Export Contract (`export.js`)

このプロジェクトが GAS ライブラリとして PartitionTable に読み込まれる際、エントリーポイントとなるのが `export.js` です。 GAS の仕様上、クラス定義はライブラリ外部から直接参照できないため、**`BootClass`** という予約されたグローバル変数に Kernel クラスを代入することで外部公開します。

JavaScript

```js
// export.js
/** 📦 GBS Export Definition */
// この変数名 'BootClass' は絶対に変更してはいけません
var BootClass = DemoOS;
```

### 7. 🧹 Smart Cache Strategy (`VERSION`)

GBSはパフォーマンスを最大化するため、クライアント側（`localStorage`）にコードを強力にキャッシュします。 アプリケーションを更新する際は、Kernelクラス内の **`VERSION`** 定数を変更するだけで、全ユーザーの古いキャッシュを自動的に破棄・更新させる「Cache Buster」機能が作動します。

```js
// DemoOS.js
this.CONST = {
  VERSION: 'v1.0.3', // 👈 ここを変えると、全ユーザーに強制アップデートがかかる
  // ...
};
```

### 8. 📦 External Library Localization (No CDN)

外部ライブラリ（Chart.js, Moment.js等）を利用する場合、CDN (`<script src="...">`) の使用は推奨されません。 代わりにライブラリのソースコードを `lib_[name].html` としてプロジェクト内に保存し、Kernelの `DEPENDENCIES` 配列に追加してください。
※`'lib_pako'`についてはシステムに非圧縮で同梱されているため不要です。

- **手順:**
    
    1. `lib_Chart.html` を作成し、`<script>...code...</script>` 内にライブラリのコードを貼り付け。        
    2. `DemoOS.js` の `DEPENDENCIES` に `'lib_Chart'` を追加。
    
- **メリット:**
    
    - ライブラリもGBSの圧縮転送・キャッシュ機構の対象となり、**2回目以降のロード時間がゼロ**になります。        
    - 外部ネットワーク（CDN）に依存しないため、イントラネット環境でも安定動作します。
        

```js
// DemoOS.js
this.CONST = {
  // ...
  DEPENDENCIES: ['lib_Chart', 'lib_DemoCore'] // 👈 自動的に結合・キャッシュされる
};
```

### 9. 🧬 Symbiosis with AppCore (Stage 1.5)

Stage 2 は単独で機能するのではなく、**Stage 1.5 (AppCore)** という仮想OS上で動作するアプリケーションです。

- **The OS Layer:** Kernelで `new LibAppCore.AppCore(this)` を実行することで、AppCoreが提供する圧縮転送、テンプレートエンジン、RPCルーティング機能を利用できます 。
  ※ [stage1.5](https://github.com/doshiraki/GBS_stage1.5/blob/main/README.md)を参照

---

## 📂 Directory Structure

GBS Stage 2 は、以下の「5つのファイル」を基本構成単位とします。

```
/
├── DemoOS.js          # [Kernel] アプリ構成定義・BIOS_exportsの受け取り
├── index.html         # [View] UIテンプレート (HTML/CSS)
├── lib_DemoCore.html  # [Logic] クライアントサイドロジック (JS)
├── Logic.js           # [Server] サーバーサイド関数群 (BIOS_exportsを利用)
├── BIOS.js            # [Loader] 開発用ブートローダー (依存オブジェクトを定義)
├── export.js          # [Export] クラス公開定義
└── appsscript.json    # プロジェクト設定 (LibAppCoreへの依存定義)
```

---

## 🚀 How to Start

新しいアプリを作成する場合は、このリポジトリをテンプレートとして使用してください。

1. **Clone:** このリポジトリをクローンまたはダウンロード。    
2. **Rename:** `DemoOS.js` を任意のアプリ名 (`MyApp.js` 等) にリネーム。
3. **Configure:** `BIOS.js` の `devAppTitle` を変更。
4. **Install:** `npm install` (必要な場合)。
5. **Deploy:** `clasp create` で新規GASプロジェクトを作成し、`clasp push`。
    

Enjoy your coding with GBS!