import React from "react";
import {
    // useLocation,
    useNavigate
} from 'react-router-dom';
import {
    Cell,
    Counter,
    Epic,
    Group,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Placeholder, Platform,
    SplitCol,
    SplitLayout,
    Tabbar,
    TabbarItem, useAdaptivityConditionalRender, usePlatform,
    View
} from "@vkontakte/vkui";
import {
    Icon28ClipOutline,
    Icon28MessageOutline, Icon28NewsfeedOutline,
    Icon28ServicesOutline,
    Icon28UserCircleOutline
} from "@vkontakte/icons";
import {Badge} from "antd";
import BotList from "./BotList";
import BotCalendar from "./BotCalendar";


const MainPage = () => {



    const platform = usePlatform();
    // const location = useLocation();
    const navigate = useNavigate();

    const { viewWidth } = useAdaptivityConditionalRender();
    const [activeStory, setActiveStory] = React.useState('Bot-List');
    const activeStoryStyles = {
        backgroundColor: 'var(--vkui--color_background_secondary)',
        borderRadius: 8,
    };
    const onStoryChange = (e:any) => {
        navigate(e.currentTarget.dataset.story , {replace: false})
        setActiveStory(e.currentTarget.dataset.story)
    };
    const hasHeader = platform !== Platform.VKCOM;

    return (
        <SplitLayout
            header={hasHeader && <PanelHeader separator={false} />}
            style={{ justifyContent: 'center' }}
        >
            {viewWidth.tabletPlus && (
                <SplitCol className={viewWidth.tabletPlus.className} fixed width={280} maxWidth={280}>
                    <Panel>
                        {hasHeader && <PanelHeader />}
                        <Group>
                            <Cell
                                disabled={activeStory === 'Bot-List'}
                                style={activeStory === 'Bot-List' ? activeStoryStyles : undefined}
                                data-story="Bot-List"
                                onClick={onStoryChange}
                                before={<Icon28NewsfeedOutline />}
                            >
                                Бот-лист
                            </Cell>
                            <Cell
                                disabled={activeStory === 'BotCalendar'}
                                style={activeStory === 'BotCalendar' ? activeStoryStyles : undefined}
                                data-story="BotCalendar"
                                onClick={onStoryChange}
                                before={<Icon28ServicesOutline />}
                            >
                                Bot Calendar
                            </Cell>
                            {/*<Cell*/}
                            {/*    disabled={activeStory === 'messages'}*/}
                            {/*    style={activeStory === 'messages' ? activeStoryStyles : undefined}*/}
                            {/*    data-story="messages"*/}
                            {/*    onClick={onStoryChange}*/}
                            {/*    before={<Icon28MessageOutline />}*/}
                            {/*>*/}
                            {/*    messages*/}
                            {/*</Cell>*/}
                            {/*<Cell*/}
                            {/*    disabled={activeStory === 'clips'}*/}
                            {/*    style={activeStory === 'clips' ? activeStoryStyles : undefined}*/}
                            {/*    data-story="clips"*/}
                            {/*    onClick={onStoryChange}*/}
                            {/*    before={<Icon28ClipOutline />}*/}
                            {/*>*/}
                            {/*    clips*/}
                            {/*</Cell>*/}
                            <Cell
                                disabled={activeStory === 'profile'}
                                style={activeStory === 'profile' ? activeStoryStyles : undefined}
                                data-story="profile"
                                onClick={onStoryChange}
                                before={<Icon28UserCircleOutline />}
                            >
                                profile
                            </Cell>
                        </Group>
                    </Panel>
                </SplitCol>
            )}

            <SplitCol width="100%" maxWidth="560px" stretchedOnMobile autoSpaced>
                <Epic
                    activeStory={activeStory}
                    tabbar={
                        viewWidth.tabletMinus && (
                            <Tabbar className={viewWidth.tabletMinus.className}>
                                <TabbarItem
                                    onClick={onStoryChange}
                                    selected={activeStory === 'Bot-List'}
                                    data-story="Bot-List"
                                    indicator={
                                        <Counter size="s" mode="prominent">
                                            12
                                        </Counter>
                                    }
                                    text="Бот-лист"
                                >
                                    <Icon28NewsfeedOutline />
                                </TabbarItem>
                                <TabbarItem
                                    onClick={onStoryChange}
                                    selected={activeStory === 'BotCalendar'}
                                    data-story="BotCalendar"
                                    text="Бот-календарь"
                                >
                                    <Icon28ServicesOutline />
                                </TabbarItem>
                                {/*<TabbarItem*/}
                                {/*    onClick={onStoryChange}*/}
                                {/*    selected={activeStory === 'messages'}*/}
                                {/*    data-story="messages"*/}
                                {/*    indicator={*/}
                                {/*        <Counter size="s" mode="prominent">*/}
                                {/*            12*/}
                                {/*        </Counter>*/}
                                {/*    }*/}
                                {/*    text="Сообщения"*/}
                                {/*>*/}
                                {/*    <Icon28MessageOutline />*/}
                                {/*</TabbarItem>*/}
                                {/*<TabbarItem*/}
                                {/*    onClick={onStoryChange}*/}
                                {/*    selected={activeStory === 'clips'}*/}
                                {/*    data-story="clips"*/}
                                {/*    text="Клипы"*/}
                                {/*>*/}
                                {/*    <Icon28ClipOutline />*/}
                                {/*</TabbarItem>*/}
                                <TabbarItem
                                    onClick={onStoryChange}
                                    selected={activeStory === 'profile'}
                                    data-story="profile"
                                    indicator={<Badge  />}
                                    text="Профиль"
                                >
                                    <Icon28UserCircleOutline />
                                </TabbarItem>
                            </Tabbar>
                        )
                    }
                >
                    <View id="Bot-List" activePanel="Bot-List">
                        <Panel id="Bot-List">
                            <PanelHeader before={<PanelHeaderBack />}>Бот-лист</PanelHeader>
                            <Group style={{ height: '1000px' }}>
                                {/*<Placeholder icon={<Icon56NewsfeedOutline width={56} height={56} />} />*/}
                                <BotList/>
                            </Group>
                        </Panel>
                    </View>

                    <View id="BotCalendar" activePanel="BotCalendar">
                        <Panel id="BotCalendar">
                            <PanelHeader before={<PanelHeaderBack />}>Бот-календарь</PanelHeader>
                            <Group style={{ height: '1000px' }}>
                                <BotCalendar/>
                            </Group>
                        </Panel>
                    </View>


                    <View id="messages" activePanel="messages">
                        <Panel id="messages">
                            <PanelHeader before={<PanelHeaderBack />}>Сообщения</PanelHeader>
                            <Group style={{ height: '1000px' }}>
                                <Placeholder icon={<Icon28MessageOutline width={56} height={56} />}></Placeholder>
                                #3
                            </Group>
                        </Panel>
                    </View>
                    <View id="clips" activePanel="clips">
                        <Panel id="clips">
                            <PanelHeader before={<PanelHeaderBack />}>Клипы</PanelHeader>
                            <Group style={{ height: '1000px' }}>
                                <Placeholder icon={<Icon28ClipOutline width={56} height={56} />}></Placeholder>
                                #4
                            </Group>
                        </Panel>
                    </View>
                    <View id="profile" activePanel="profile">
                        <Panel id="profile">
                            <PanelHeader before={<PanelHeaderBack />}>Профиль</PanelHeader>
                            <Group style={{ height: '1000px' }}>
                                <Placeholder
                                    icon={<Icon28UserCircleOutline width={56} height={56} />}
                                ></Placeholder>
                                #5
                                1) мои достижения
                                2) проваленные сроки
                                3) время по проектам (полочкам)
                            </Group>
                        </Panel>
                    </View>
                </Epic>
            </SplitCol>
        </SplitLayout>
    );
};

export default MainPage;
