import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: '利用規約・免責事項 - ナースシフト',
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl shadow-gray-200/50 px-5 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          戻る
        </Link>

        <h1 className="text-lg font-bold text-gray-800 mb-6">利用規約・免責事項</h1>

        <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="font-bold text-gray-800 mb-2">1. サービス概要</h2>
            <p>
              ナースシフト（以下「本アプリ」）は、看護師向けのシフト管理・共有を目的とした無料のWebアプリケーションです。
            </p>
          </section>

          <section>
            <h2 className="font-bold text-gray-800 mb-2">2. 免責事項</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>本アプリは個人が開発・運営しており、医療機関の公式なシフト管理システムではありません。</li>
              <li>本アプリの利用により生じたいかなる損害についても、開発者は一切の責任を負いません。</li>
              <li>シフトデータの正確性については、ご自身でご確認ください。勤務先の公式なシフト表を必ず優先してください。</li>
              <li>本アプリは予告なくサービスの変更・停止を行う場合があります。</li>
              <li>データの消失・破損について、開発者は責任を負いません。</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-gray-800 mb-2">3. データの取り扱い</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>個人のシフトデータはブラウザのLocalStorageに保存されます。</li>
              <li>グループ共有機能を使用した場合、シフトデータはクラウドサーバー（Supabase）に保存されます。</li>
              <li>患者情報や医療情報は一切取り扱いません。入力しないでください。</li>
              <li>ユーザー認証にはデバイスIDを使用しており、メールアドレス等の個人情報は収集しません。</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-gray-800 mb-2">4. 天気情報</h2>
            <p>
              天気情報はOpen-Meteo API（オープンソースの天気API）から取得しています。天気予報の正確性について、開発者は保証しません。
            </p>
          </section>

          <section>
            <h2 className="font-bold text-gray-800 mb-2">5. 禁止事項</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>本アプリへの不正アクセスやサーバーへの過度な負荷をかける行為</li>
              <li>他のユーザーのデータを不正に取得・改ざんする行為</li>
              <li>本アプリを商用目的で利用する行為</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-gray-800 mb-2">6. 著作権</h2>
            <p>
              本アプリのデザイン・ソースコードの著作権は開発者に帰属します。
            </p>
          </section>

          <section>
            <h2 className="font-bold text-gray-800 mb-2">7. 規約の変更</h2>
            <p>
              本規約は予告なく変更される場合があります。変更後の規約は本ページに掲載した時点で効力を生じます。
            </p>
          </section>

          <p className="text-xs text-gray-400 pt-4">
            最終更新日: 2026年4月19日
          </p>
        </div>
      </div>
    </main>
  )
}
