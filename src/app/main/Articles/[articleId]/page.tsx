
type Props = {
    params: {
      articleId: string,
    }
}

function Article({ params: { articleId } }: Props) {
  return <div>Article ID: {articleId}</div>;
}

export default Article;