import { Redirect } from "expo-router";

//화면을 렌더링하지 않고 즉시 메인 페이지로 이동
export default function Home() {
  return <Redirect href="/(tabs)" />;
}