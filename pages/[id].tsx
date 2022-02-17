export default function Id() {
  return <div>Heyt</div>;
}

export function getStaticProps({ params }) {
  const { id } = params;

  return { props: {} };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}
