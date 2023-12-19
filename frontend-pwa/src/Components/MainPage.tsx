import React, {useEffect, useState} from 'react';
import {
    Outlet,
    useLocation,
    useNavigate
} from 'react-router-dom';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
    CustomerServiceOutlined,
    CommentOutlined
} from '@ant-design/icons';
import {
    Layout, Menu,
    // Button,
    theme, Breadcrumb, Button, FloatButton
} from 'antd';
import Sider from "antd/es/layout/Sider";
import {
    Panel, PanelHeader,
    Platform,
    SplitCol,
    SplitLayout,
    useAdaptivityConditionalRender,
    usePlatform,
    View
} from '@vkontakte/vkui';


const {Header, Content, Footer} = Layout;
const MainPage = () => {
    const platform = usePlatform();
    const location = useLocation();
    const navigate = useNavigate();

    const isVKCOM = platform === Platform.VKCOM;
    const {viewWidth} = useAdaptivityConditionalRender();


    console.log('#1', platform)
    console.log('#1', platform)
    useEffect(() => {
        console.log('Current location is ', location);
    }, [location]);

    const [collapsed, setCollapsed] = useState(false);
    const {
        token: {colorBgContainer},
    } = theme.useToken();


    const MainScreens = () => {
        return (
            <View activePanel="profile">
                <Panel id="profile">
                    <Layout>
                        <Content className="site-layout" style={{padding: '0 50px'}}>
                            <Breadcrumb style={{margin: '16px 0'}}>
                                {/*<Breadcrumb.Item>Home</Breadcrumb.Item>*/}
                                {/*<Breadcrumb.Item>{location.pathname}</Breadcrumb.Item>*/}
                            </Breadcrumb>
                            <div style={{padding: 24, minHeight: 380, background: colorBgContainer}}>
                                <Outlet/>
                                <>
                                    <FloatButton.Group
                                        trigger="hover"
                                        type="primary"
                                        style={{right: 23}}
                                        icon={<CustomerServiceOutlined/>}
                                    >
                                        <FloatButton/>
                                        <FloatButton icon={<CommentOutlined/>}/>
                                    </FloatButton.Group>
                                </>

                            </div>
                        </Content>
                        <Footer style={{textAlign: 'center'}}>Ant Design ©2023 Created by Ant UED</Footer>
                    </Layout>
                </Panel>
            </View>
        );
    };

    const SideCol = () => {
        return <Panel id="nav">
            <Layout>
                <Sider trigger={null} collapsible collapsed={collapsed}>
                    <div className="demo-logo-vertical"/>
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={['list']}
                        items={[
                            {
                                key: 'list',
                                icon: <UserOutlined/>,
                                label: 'Список',
                            },
                            {
                                key: 'two',
                                icon: <VideoCameraOutlined/>,
                                label: 'Календарь',
                            },
                            {
                                key: 'BotCalendarV2',
                                icon: <UploadOutlined/>,
                                label: 'Ntcn',
                            },
                        ]}
                        onClick={x => {
                            console.log('#1', x)
                            navigate(x.key, {replace: false})
                        }}
                    />
                </Sider>
            </Layout>
        </Panel>;
    };

    return (
        <>
            {/*<Layout>*/}
            <SplitLayout header={!isVKCOM && <PanelHeader separator={false}/>}>
                {viewWidth.tabletPlus && (
                    <SplitCol className={viewWidth.tabletPlus.className}>
                        <SideCol/>
                        {/*<Header*/}
                        {/*    style={{*/}
                        {/*        position: 'sticky',*/}
                        {/*        top: 0,*/}
                        {/*        zIndex: 1,*/}
                        {/*        width: '100%',*/}
                        {/*        display: 'flex',*/}
                        {/*        alignItems: 'center',*/}
                        {/*    }}*/}
                        {/*>*/}
                        {/*    <div className="demo-logo"/>*/}
                        {/*    <Button*/}
                        {/*        type="text"*/}
                        {/*        icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}*/}
                        {/*        onClick={() => setCollapsed(!collapsed)}*/}
                        {/*        style={{*/}
                        {/*            fontSize: '16px',*/}
                        {/*            width: 64,*/}
                        {/*            height: 64,*/}
                        {/*            color: '#ffffffa6'*/}
                        {/*        }}*/}
                        {/*    />*/}


                        {/*    <Menu*/}
                        {/*        theme="dark"*/}
                        {/*        mode="horizontal"*/}
                        {/*        defaultSelectedKeys={['2']}*/}
                        {/*        items={new Array(3).fill(null).map((_, index) => ({*/}
                        {/*            key: String(index + 1),*/}
                        {/*            label: `nav ${index + 1}`,*/}
                        {/*        }))}*/}
                        {/*    />*/}
                        {/*</Header>*/}
                        {/*<Sider trigger={null} collapsible collapsed={collapsed}>*/}
                        {/*    <div className="demo-logo-vertical"/>*/}
                        {/*    <Menu*/}
                        {/*        theme="dark"*/}
                        {/*        mode="inline"*/}
                        {/*        defaultSelectedKeys={['list']}*/}
                        {/*        items={[*/}
                        {/*            {*/}
                        {/*                key: 'list',*/}
                        {/*                icon: <UserOutlined/>,*/}
                        {/*                label: 'Список',*/}
                        {/*            },*/}
                        {/*            {*/}
                        {/*                key: 'two',*/}
                        {/*                icon: <VideoCameraOutlined/>,*/}
                        {/*                label: 'Календарь',*/}
                        {/*            },*/}
                        {/*            {*/}
                        {/*                key: 'BotCalendarV2',*/}
                        {/*                icon: <UploadOutlined/>,*/}
                        {/*                label: 'Ntcn',*/}
                        {/*            },*/}
                        {/*        ]}*/}
                        {/*        onClick={x => {*/}
                        {/*            console.log('#1', x)*/}
                        {/*            navigate(x.key, {replace: false})*/}
                        {/*        }}*/}
                        {/*    />*/}
                        {/*</Sider>*/}

                    </SplitCol>)}
                <SplitCol>
                    <MainScreens/>
                </SplitCol>

            </SplitLayout>
            {/*<Footer style={{textAlign: 'center'}}>Ant Design ©2023 Created by Ant UED</Footer>*/}


            {/*</Layout>*/}
        </>
    )
};
export default MainPage;
