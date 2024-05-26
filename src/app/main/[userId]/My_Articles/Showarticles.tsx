"use client"

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';


import Link from 'next/link';


type ArticleInfo = {
  articleId: string,
  articleTitle: string,
  articleContent: string,
  mrtdisplayId: string,
  mrtName: string,
}

type ArticleProps = {
  articles: ArticleInfo[],
  userId: string,
}

function ShowArticles({ articles,userId }: ArticleProps) {


  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Article Title</TableCell>
            <TableCell>Article Content</TableCell>
            <TableCell>MRT Station</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {articles.map((article, index) => (
            <TableRow key={index}>
              <TableCell>{article.articleTitle}</TableCell>
              <TableCell>{article.articleContent}</TableCell>
              <TableCell>{article.mrtName}</TableCell>
              <TableCell>
                <Link href={`/main/${userId}/My_Articles/${article.articleId}`}>
                  <Button>
                    Edit
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ShowArticles