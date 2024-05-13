
type Props = {
    params: {
        userId: string,
    }
}

function MyInfo({ params: { userId } }: Props) {
  return <div>User ID: {userId}</div>;
}

export default MyInfo;