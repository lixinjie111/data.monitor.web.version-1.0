import Cookies from 'js-cookie'

let backData = [
    {
        
        "name": "客户管理",
        "path": "",
        "icon": "el-icon-mc-user-list",
        "enable": "Y",
        "component": null,
        "children": [
            {
                "name": "客户列表",
                "path": "usermanage/userList",
                "enable": "Y",
                "component": null,
                "children": [],
            }
        ]
    }
];



let getMenuList = (roles) => {
	let routerList = backData;
	return routerList;
};


export default getMenuList;