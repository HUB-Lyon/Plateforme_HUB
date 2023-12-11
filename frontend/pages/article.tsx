import React from 'react';
import matter from 'gray-matter';
import MarkdownView from 'react-showdown';

interface ArticleProps {
  articlesData: Array<{ content: string; frontmatter: { title: string; date: string } }>;
}

interface ArticleData {
    id: number;
    name: string;
    content: string;
}

const Article: React.FC<ArticleProps> = ({ articlesData }) => {
    return (
        <div>
            <h1 className="text-7xl text-center mb-6 font-bold">Articles</h1>
            <div className="markdown flex flex-col items-center gap-y-10 mb-10">
                {articlesData.map(({ content, frontmatter }, index) => (
                    <div key={index} className="markdown">
                        <h1>{frontmatter.title}</h1>
                        <p>{frontmatter.date}</p>
                        <div className="flex-box w-full md:px-8 px-4 md:py-8 py-4">
                            <MarkdownView
                                markdown={content}
                                options={{ tables: true, emoji: true }}
                                flavor="github"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export async function getStaticProps() {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const result = await fetch('http://localhost:3000/article/', options);
    const articles = await result.json();

    const articlesData = articles.map((article: ArticleData) => {
        const { content, data } = matter(article);
        return {
            content,
            frontmatter: data,
        };
    });

    return {
        props: {
            articlesData,
        },
    };
}

export default Article;
