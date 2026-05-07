# OVC 온라인 연결

Netlify에서 회원가입, 로그인, 다른 사람 캐릭터 보기를 쓰려면 Supabase 프로젝트가 필요합니다.

1. Supabase에서 새 프로젝트를 만듭니다.
2. SQL Editor에 들어가서 `supabase-schema.sql` 내용을 실행합니다.
3. Project Settings > API에서 Project URL과 Publishable key 또는 anon public key를 복사합니다.
4. `online-config.js`에 붙여 넣습니다.

```js
window.OVC_ONLINE_CONFIG = {
  supabaseUrl: "https://프로젝트주소.supabase.co",
  supabaseKey: "복사한 publishable 또는 anon key",
  accountsTable: "ovc_accounts",
  multiplayerRoom: "ovc-main-room"
};
```

5. Netlify에 다시 업로드합니다.

현재 멀티플레이 1단계는 같은 방에 접속한 다른 플레이어의 이름, 색깔, 위치를 실시간으로 보여주는 방식입니다. 아이템 줍기, 물 주기, 식물 상태 공유는 다음 단계에서 서버 상태로 옮겨야 합니다.

주의: 지금 로그인은 빠른 테스트용입니다. 비밀번호는 브라우저에서 SHA-256으로 바꿔 저장하지만, 전문 서비스 수준의 보안은 아닙니다.
