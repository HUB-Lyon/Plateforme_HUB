import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import MarkdownView from 'react-showdown';

interface ArticleProps {
  articlesData: Array<{ content: string; frontmatter: { title: string; date: string } }>;
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
                        <div className="flex-box w-full pl-8 pt-8   ">
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
    const articlesDir = path.join(process.cwd(), 'articles');
    const filenames = fs.readdirSync(articlesDir);

    const articlesData = filenames.map((filename) => {
        const markdownPath = path.join(articlesDir, filename);
        const fileContents = fs.readFileSync(markdownPath, 'utf-8');
        const { content, data } = matter(fileContents);
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
