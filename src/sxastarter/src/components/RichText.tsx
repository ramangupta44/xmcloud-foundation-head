import React, { useState } from 'react';
import { Field, useSitecoreContext, RichText } from '@sitecore-jss/sitecore-jss-nextjs';
import axios from 'axios';
interface Fields {
  Text: Field<string>;
}

const OpenAIAPIKey = process.env.NEXT_PUBLIC_CHAT_GPT_KEY;

type ChatGPTProps = [role: string, content: unknown];

type ChatGPTResponse = {
  role: string;
  content: string;
};
export type RichTextProps = {
  params: { [key: string]: string };
  fields: Fields;
};

export const Default = (props: RichTextProps): JSX.Element => {
  const [responseData, setResponseData] = useState<ChatGPTProps>([] as unknown as ChatGPTProps);
  const fetchMessage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const buttonText = (e.target as HTMLButtonElement).innerText;
    let input = '';
    if (typeof document != undefined) {
      input = (document.querySelector('.richtext-reusable .rte-text >input') &&
        (document.querySelector('.richtext-reusable .rte-text >input') as HTMLInputElement)
          ?.value) as string;
    }

    const finalText = buttonText + ' ' + input;
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: finalText },
        ],
        model: 'gpt-3.5-turbo',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OpenAIAPIKey}`,
        },
      }
    );

    setResponseData([
      { role: 'assistant', content: response.data.choices[0].message.content },
    ] as unknown as ChatGPTProps);
  };

  const { sitecoreContext } = useSitecoreContext();
  const isEdit = sitecoreContext?.pageEditing;

  return (
    <div>
      <RichText field={props?.fields?.Text} tag="div" className="rte-text" />
      {isEdit && (
        <>
          <button onClick={fetchMessage} className="button">
            Answer
          </button>
          <button onClick={fetchMessage} className="button">
            Rewrite
          </button>
          <button onClick={fetchMessage} className="button">
            Summarize
          </button>
          <button onClick={fetchMessage} className="button">
            Proof Read
          </button>
        </>
      )}
      <div>
        {responseData.map((data: ChatGPTResponse, index) => (
          <div key={index} className={data?.role}>
            {data?.content}
          </div>
        ))}
      </div>
    </div>
  );
};
