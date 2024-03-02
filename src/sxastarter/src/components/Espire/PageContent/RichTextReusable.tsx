import React, { ReactNode, useState } from 'react';
import { RichTextReusableTemplateProps } from 'lib/component-props/EspireTemplateProps/PageContent/RichTextReusableTemplateProps';
import {
  RichText,
  useSitecoreContext,
  withDatasourceCheck,
} from '@sitecore-jss/sitecore-jss-nextjs';
import axios from 'axios';

const OpenAIAPIKey = process.env.NEXT_PUBLIC_CHAT_GPT_KEY;

type ChatGPTProps = [role: string, content: unknown];

type ChatGPTResponse = {
  role: string;
  content: string;
};

export const RichTextReusable = (props: RichTextReusableTemplateProps): JSX.Element => {
  const [responseData, setResponseData] = useState<ChatGPTProps>([] as unknown as ChatGPTProps);
  const [showAccept, setShowAccept] = useState<boolean>(false);
  const [text, setText] = useState('');
  const fetchMessage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const buttonText = (e.target as HTMLButtonElement).innerText;
    let input = props?.fields?.RichText?.value;
    if (typeof document != undefined) {
      input = (document.querySelector('.richtext-reusable .rte-text >input') &&
        (document.querySelector('.richtext-reusable .rte-text >input') as HTMLInputElement)
          ?.value) as string;
    }
    if (input == null || input == undefined) {
      input = props?.fields?.RichText?.value;
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
    setShowAccept(true);
  };

  const { sitecoreContext } = useSitecoreContext();
  const isEdit = sitecoreContext?.pageEditing;

  const responseMessage = (): ReactNode => {
    return responseData?.map((data: ChatGPTResponse) => {
      return data?.content;
    });
  };
  const updateTextValue = () => {
    if (typeof document != undefined) {
      if (document.querySelector('.richtext-reusable .rte-text ')) {
        const updateDOM = document.querySelector('.richtext-reusable .rte-text ');
        if (updateDOM) {
          updateDOM.innerHTML = text;
        }
      }
    }
    setShowAccept(false);
  };

  return (
    <div className={`richtext-reusable ${props.params.styles}`}>
      <RichText field={props?.fields?.RichText} tag="div" className="rte-text" />
      {!isEdit && (
        <>
          <button onClick={fetchMessage} className="button">
            Generate
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
        {showAccept && (
          <>
            <textarea
              className="updated-text"
              name="w3review"
              rows={20}
              cols={150}
              defaultValue={responseMessage() as string}
              onChange={(e) => {
                setText(e.target.value);
              }}
            ></textarea>
            <div>
              {(responseMessage() as string)?.length > 0 && (
                <button onClick={updateTextValue} className="button">
                  Accept
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default withDatasourceCheck()<RichTextReusableTemplateProps>(RichTextReusable);
