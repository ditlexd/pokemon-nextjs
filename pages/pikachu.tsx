import { useRouter } from 'next/router';

export default function Pikachu() {
  const { query } = useRouter();
  const { pikachu } = query;
  console.log(query);
  return <div>Hey number {pikachu}</div>;
}
