# Tech Transfer Market

日本のITエンジニア採用市場をサッカー移籍市場のように楽しむ、モバイルファーストの1人用クラブ経営ゲームです。Next.js App Router、React、TypeScript、Zod、localStorageで構成し、Vercelへ公開します。

## ローカル開発

```bash
npm ci
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。Production相当の起動確認は次で行います。

```bash
npm run build
npm start
```

品質Gate:

```bash
npm run lint
npm run test
npm run build
```

ゲーム仕様と受け入れ条件の正本は `docs/init-mvp-spec.md` です。
