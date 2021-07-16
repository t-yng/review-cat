# スタイルガイド

## デザイン
- リセットCSS は [The New CSS Reset](https://github.com/elad2412/the-new-css-reset) を利用
- アイコンは [Octicons](https://primer.style/octicons/) を利用

## コンポーネント設計
- Functional Component で実装する
- ビジネスロジックはカスタムフックで分離する
- Container Component と Presentational Component に分離する
    - Container Component はAPIリクエストなどのロジックやボタンのコールバック処理などのロジックに責任を持つ
    - Presentational Component は見た目に責任を持つ
- Presentational Component は出来る限り純粋関数として実装する
    - propsだけに依存している状態
- コンポーネント名はパスカルケース

## その他
- export default は使用しない
