import React from "react";
import {
    useLocation,
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
    Icon28ServicesOutline, Icon28Settings,
    Icon28UserCircleOutline
} from "@vkontakte/icons";
import {Badge} from "antd";
import BotList from "./BotList/BotList";
import BotCalendarPage from "./Calendar/BotCalendarPage";
import UserProfile from "./UserProfile/UserProfile";
import SettingPage from "./settings/SettingPage";
import AuthPage from "./AuthPage/AuthPage";


const MainPage = (props:any) => {

    console.log('#1 props 1', props)

    const platform = usePlatform();
    const location = useLocation();
    const navigate = useNavigate();

    const { viewWidth } = useAdaptivityConditionalRender();
    const [activeStory, setActiveStory] = React.useState(location.pathname);



    const activeStoryStyles = {
        backgroundColor: 'var(--vkui--color_background_secondary)',
        borderRadius: 8,
    };
    const onStoryChange = (e:any) => {
        setActiveStory(e.currentTarget.dataset.story)
        navigate(e.currentTarget.dataset.story , {replace: false})
    };
    console.log("#1", location.pathname);
    
    // setActiveStory(location.pathname)
    const hasHeader = platform !== Platform.VKCOM;

    return (
        <SplitLayout
            header={hasHeader && <PanelHeader />}
            style={{ justifyContent: 'center' }}
        >
            {viewWidth.tabletPlus && (
                <SplitCol className={viewWidth.tabletPlus.className} fixed width={280} maxWidth={280}>
                    <Panel>
                        {hasHeader && <PanelHeader />}
                        <Group>
                            <Cell
                                disabled={activeStory === '/Bot-List'}
                                style={activeStory === '/Bot-List' ? activeStoryStyles : undefined}
                                data-story="/Bot-List"
                                onClick={onStoryChange}
                                before={<Icon28NewsfeedOutline />}
                            >
                                Бот-лист
                            </Cell>
                            <Cell
                                disabled={activeStory === '/BotCalendarPage'}
                                style={activeStory === '/BotCalendarPage' ? activeStoryStyles : undefined}
                                data-story="/BotCalendarPage"
                                onClick={onStoryChange}
                                before={<Icon28ServicesOutline />}
                            >
                                Bot Calendar
                            </Cell>
                            <Cell
                                disabled={activeStory === '/profile'}
                                style={activeStory === '/profile' ? activeStoryStyles : undefined}
                                data-story="/profile"
                                onClick={onStoryChange}
                                before={<Icon28UserCircleOutline />}
                            >
                                profile
                            </Cell>
                            <Cell
                                disabled={activeStory === '/settings'}
                                style={activeStory === '/settings' ? activeStoryStyles : undefined}
                                data-story="/settings"
                                onClick={onStoryChange}
                                before={<Icon28Settings />}
                            >
                                settings
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
                                    selected={activeStory === '/Bot-List'}
                                    data-story="/Bot-List"
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
                                    selected={activeStory === '/BotCalendarPage'}
                                    data-story="/BotCalendarPage"
                                    text="Бот-календарь"
                                >
                                    <Icon28ServicesOutline />
                                </TabbarItem>
                                <TabbarItem
                                    onClick={onStoryChange}
                                    selected={activeStory === '/profile'}
                                    data-story="/profile"
                                    indicator={<Badge  />}
                                    text="Профиль"
                                >
                                    <Icon28UserCircleOutline />
                                </TabbarItem>
                                <TabbarItem
                                    onClick={onStoryChange}
                                    selected={activeStory === '/settings'}
                                    data-story="/settings"
                                    indicator={<Badge  />}
                                    text="settings"
                                >
                                    <Icon28Settings />
                                </TabbarItem>
                            </Tabbar>
                        )
                    }
                >
                    <View id="/Bot-List" activePanel="/Bot-List">
                        <Panel id="/Bot-List">
                                  <BotList  props={props} />
                        </Panel>
                    </View>

                    <View id="/BotCalendarPage" activePanel="/BotCalendarPage">
                        <Panel id="/BotCalendarPage">
                            <PanelHeader before={<PanelHeaderBack />}>Бот-календарь</PanelHeader>
                            <Group
                                // style={{ height: '1000px' }}
                            >
                                <BotCalendarPage/>
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
                    <View id="/profile" activePanel="/profile">
                        <Panel id="/profile">
                            <PanelHeader before={<PanelHeaderBack />}>Профиль</PanelHeader>
                            <Group style={{ height: '1000px' }}>
                                <UserProfile props={props} ></UserProfile>
                            </Group>
                        </Panel>
                    </View>
                    <View id="/settings" activePanel="/settings">
                        <Panel id="/settings">
                            <PanelHeader before={<PanelHeaderBack />}>settings</PanelHeader>
                            {/*<Group style={{ height: '1000px' }}>*/}
                                <SettingPage props={props} ></SettingPage>
                            {/*</Group>*/}
                        </Panel>
                    </View>
                    <View id="/AuthPage" activePanel="/AuthPage">
                        <Panel id="/AuthPage">
                            <PanelHeader before={<PanelHeaderBack />}>settings</PanelHeader>
                            <Group style={{ height: '1000px' }}>
                                <AuthPage props={props} ></AuthPage>
                            </Group>
                        </Panel>
                    </View>
                    <View id="/Registration" activePanel="/Registration">
                        <Panel id="/Registration">
                            <PanelHeader before={<PanelHeaderBack />}>settings</PanelHeader>
                            <Group style={{ height: '1000px' }}>
                                <AuthPage props={props} ></AuthPage>
                            </Group>
                        </Panel>
                    </View>
                </Epic>
            </SplitCol>
        </SplitLayout>
    );
};

export default MainPage;
