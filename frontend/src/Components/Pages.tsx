import { loremIpsum } from 'lorem-ipsum';
import { ReactElement, JSXElementConstructor, ReactNode } from 'react';
import BotList from "./BotList/BotList";

const BuildPage = (index: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined) => (
    <>
        <h3>Page {index}</h3>
        <div>
            Page {index} content: { loremIpsum({ count: 5 })}
        </div>
    </>
);

export const PageOne = () => <BotList/>;
export const PageTwo = () => BuildPage(2);
