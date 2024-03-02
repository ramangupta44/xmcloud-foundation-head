/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { RichTextReusableTemplateProps } from 'lib/component-props/EspireTemplateProps/PageContent/RichTextReusableTemplateProps';
import { RichText, withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import axios from 'axios';

const OpenAIAPIKey = process.env.NEXT_PUBLIC_CHAT_GPT_KEY;

type ChatGPTProps = [role: string, content: unknown];

type ChatGPTResponse = {
  role: string;
  content: string;
};

export const RichTextReusable = (props: RichTextReusableTemplateProps): JSX.Element => {
  const [responseData, setResponseData] = useState<ChatGPTProps>([] as unknown as ChatGPTProps);
  const input = props?.fields?.RichText?.value;
  const buttonText = props?.fields?.Button?.value;
  const finalText = buttonText + ' ' + input;
  const fetchMessage = async () => {
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
      ...responseData,
      { role: 'assistant', content: response.data.choices[0].message.content },
    ] as unknown as ChatGPTProps);

    console.log(response , "response")
  };

  return (
    <div className={`richtext-reusable ${props.params.styles}`}>
      <RichText field={props?.fields?.RichText} />
      <button onClick={fetchMessage}>{props?.fields?.Button?.value}</button>
      <button onClick={fetchMessage}>{process.env.RTEButtonText}</button>
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

export default withDatasourceCheck()<RichTextReusableTemplateProps>(RichTextReusable);
