import React from "react";
import {
    Avatar,
    Input,
    Button,
    FormItem,
    Group,
    Header,
    HorizontalCell,
    HorizontalScroll,
    Separator,
    Cell,
    FixedLayout,
    WriteBar,
    WriteBarIcon,
    Div,
    AdaptiveIconRenderer,
    usePlatform, Counter
} from "@vkontakte/vkui";

import {
    Icon28UserOutline,
    Icon24VoiceOutline,
    Icon28SmileOutline,
    Icon28VoiceOutline,
    Icon24SmileOutline,
    Icon20UserCircleFillBlue
} from "@vkontakte/icons";
import MassagesListIhUser from "./MassagesListIhUser/MassagesListIhUser";
import useSocket from "../../hooks/useSocket";
// import useSocket from "../../hooks/useSocket";
// import UserList from "./UserList";
// import MessageList from "./MessageList";
// import MessageInput from "./MessageInput";




const SettingPage = ({props}: any) => {
    const {
        users,
        inputLoginData,
        selectedUser,
        selectUserMassages,
        thisUserID,
        sendMassage,
        selectedUser2,
        onUsernameSelection,
        loginData,
        text,
        setText,
        usernameAlreadySelected,
        isAttachmentsShown,
        setIsAttachmentsShown
    } = useSocket( props );
    const platform = usePlatform();
    const SmileOutlineIcon = (
        <AdaptiveIconRenderer
            IconCompact={platform === 'ios' ? Icon28SmileOutline : Icon24SmileOutline}
            IconRegular={Icon28SmileOutline}
        />
    );
    const VoiceOutlineIcon = (
        <AdaptiveIconRenderer
            IconCompact={platform === 'ios' ? Icon28VoiceOutline : Icon24VoiceOutline}
            IconRegular={Icon28VoiceOutline}
        />
    );
    const attachmentsCount = 5;

    return (
        <div>
            {!usernameAlreadySelected && <div>
                <FormItem top="Вход">
                    <Input placeholder="Логин" onInput={loginData}/>
                </FormItem>
                <FormItem>
                    <Input placeholder="Пароль"/>
                </FormItem>
                <Button
                    size="l"
                    mode="primary"
                    stretched
                    onClick={() => onUsernameSelection(inputLoginData)}
                >
                    Попробовать
                </Button>
            </div>}
            {usernameAlreadySelected && <div>
                <div>
                    <Group>
                        <Cell
                            expandable="auto"
                            before={<Icon28UserOutline/>}
                            onClick={() => selectedUser2(props.globalProps.user.login)}
                        >
                            <p>{props.globalProps.user.login} - {platform}</p>
                        </Cell>
                    </Group>
                </div>
                <Separator/>
                <div>
                    <Group header={<Header mode="secondary">друзья</Header>}>
                        <HorizontalScroll
                            showArrows
                            getScrollToLeft={(i) => i - 120}
                            getScrollToRight={(i) => i + 120}
                        >
                            <div style={{display: 'flex'}}>
                                {users.map((item: {
                                    userID: React.Key | null | undefined;
                                    username: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined;
                                    connected: boolean | undefined;
                                }) => {
                                    return (
                                        <HorizontalCell onClick={() => {
                                            selectedUser2(String(item.userID))
                                        }}
                                                        key={item.userID}
                                                        header={item.username}
                                                        activated={item.userID === selectedUser}
                                                        subtitle={(item.userID === thisUserID) ? 'Заметки' : ''}


                                        >
                                            <Avatar size={56}
                                                    src={'/frontend/build/images/avatar.jpeg'}

                                            >
                                                <div style={{   right: '14px',
                                                                bottom: '-30px',
                                                                position: 'relative'}}>
                                                <Avatar.Badge background={'stroke'} >
                                                    <Counter size="s" mode="primary">
                                                        2
                                                    </Counter>
                                                </Avatar.Badge>
                                                </div>
                                                    {item.connected && item.userID === thisUserID &&
                                                    <Avatar.Badge background={"stroke"}>
                                                        <Icon20UserCircleFillBlue width={16} height={16}/>
                                                    </Avatar.Badge>}
                                                {item.connected && item.userID !== thisUserID &&
                                                    <Avatar.BadgeWithPreset preset={"online"}/>}
                                            </Avatar>
                                        </HorizontalCell>
                                    );
                                })}
                            </div>
                        </HorizontalScroll>
                    </Group>
                </div>
                <Separator/>

                <MassagesListIhUser
                    users={users}
                    selectUserMassages={selectUserMassages}
                    thisUserID={thisUserID}
                    />

                <Group style={{height: '20px', opacity: 0}}>
                </Group>
                <FixedLayout
                    vertical="bottom"
                    // vertical="top"
                    filled
                >
                    <div>
                        <Separator wide/>

                        {isAttachmentsShown && (
                            <div>
                                <Div>Интерфейс прикрепления</Div>
                                <Separator wide/>
                            </div>
                        )}

                        <WriteBar
                            before={
                                <WriteBarIcon
                                    mode="attach"
                                    onClick={() => setIsAttachmentsShown(!isAttachmentsShown)}
                                    count={attachmentsCount}
                                />
                            }
                            inlineAfter={
                                text.length > 0 && (
                                    <WriteBarIcon>{SmileOutlineIcon}</WriteBarIcon>
                                )
                            }
                            after={
                                <>
                                    {text.length === 0 && (
                                        <WriteBarIcon>{SmileOutlineIcon}</WriteBarIcon>
                                    )}
                                    {text.length === 0 && (
                                        <WriteBarIcon>
                                            {VoiceOutlineIcon}
                                        </WriteBarIcon>
                                    )}
                                    {text.length > 0 &&
                                        <WriteBarIcon mode="send" onClick={() => sendMassage()}/>}
                                </>
                            }
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={(e) => {
                                if (text.length > 0 && e.key === 'Enter' && !e.ctrlKey) {
                                    if (text === '\n') {
                                        e.preventDefault();
                                        setText('')
                                    }
                                    else
                                    {
                                        e.preventDefault();
                                        sendMassage();
                                    }
                                } else if (e.key === 'Enter' && e.ctrlKey) {
                                    setText(text + "\n");
                                }
                            }}
                            placeholder="Сообщение"
                        />
                    </div>
                </FixedLayout>
            </div>}
        </div>
    );
}
export default SettingPage;
