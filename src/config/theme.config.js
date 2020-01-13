export const THEME_CONFIG = {
  // 静态背景
  staticBg: {
    name: "staticBg",
    desc: "静态背景",
    descImg: "./img/icon-bg.jpg",
    config: [{
      name: "bg",
      desc: "背景",
      dataType: "bg",
      options: [{
          type: "color",
          bg: "#00010b"
        },
        {
          type: "color",
          bg: "#051b44"
        },
        {
          type: "img",
          bg: "url(./img/firstbg.jpg)"
        },
        {
          type: "img",
          bg: "url(./img/firstbgb.jpg)"
        }
      ]
    }]
  },
  // 星空飞行穿梭
  starFly: {
    name: "starFly",
    desc: "星空飞行穿梭",
    descImg: "./img/starsky.png",
    config: [{
        name: "starNum",
        desc: "星星个数",
        dataType: "number",
        min: 100,
        max: 1000
      },
      {
        name: "starSpeed",
        desc: "星星速度",
        dataType: "number",
        min: 1,
        max: 10
      },
      {
        name: "skyDepth",
        desc: "星星深度",
        dataType: "number",
        min: 100,
        max: 300
      },
      {
        name: "bg",
        desc: "背景",
        dataType: "bg",
        options: [{
            type: "color",
            bg: "#00010b"
          },
          {
            type: "color",
            bg: "#000b42"
          },
          {
            type: "color",
            bg: "#0d2080"
          }
        ]
      }
    ]
  },
  // 云朵
  clouds: {
    name: 'clouds',
    desc: '云朵',
    descImg: './img/clouds.png',
    config: [{
        'name': 'cloudSpeed',
        'desc': '漂移速度',
        'dataType': 'number',
        'min': 1,
        'max': 10,
        'default': 5
      },
      {
        'name': 'bg',
        'desc': '背景',
        'dataType': 'bg',
        'options': [
          {
            type: "color",
            bg: "#051b44"
          },
          {
            type: "color",
            bg: 'linear-gradient(45deg, #051b44 0%,#4f3258 100%),linear-gradient(#00010b,#00010b)'
          },
          {
            type: "color",
            bg: 'linear-gradient(90deg,#311956 0%,#1d4350 100%),linear-gradient(#00010b, #00010b)'
          },
          {
            type: "color",
            bg: 'linear-gradient(90deg, #061161 0%, #6f0000 100%),linear-gradient(#00010b, #00010b)'
          },
        ],
        'default': 'animatebg1'
      }
    ]
  },
  // 流行划过
  meteorDrop: {
    name: "meteorDrop",
    desc: "流行划过",
    descImg: "./img/starflash.png",
    config: [{
        name: "starNum",
        desc: "星星个数",
        dataType: "number",
        min: 100,
        max: 500
      },
      {
        name: "starblinkSpeed",
        desc: "闪烁速率",
        dataType: "number",
        min: 10,
        max: 50
      },
      {
        name: "bg",
        desc: "背景",
        dataType: "bg",
        options: [{
            type: "color",
            bg: "#00010b"
          },
          {
            type: "color",
            bg: "#051b44"
          },
          {
            type: "img",
            bg: "url(./img/firstbg.jpg)"
          },
          {
            type: "img",
            bg: "url(./img/firstbgb.jpg)"
          }
        ]
      }
    ]
  },
  // 编织星空
  starPlait: {
    name: "starPlait",
    desc: "编织星空",
    descImg: "./img/starplait.png",
    config: [{
        name: "starNum",
        desc: "星星个数",
        dataType: "number",
        min: 50,
        max: 200
      },
      {
        name: "plaitSpeed",
        desc: "漂移速度",
        dataType: "number",
        min: 5,
        max: 50
      },
      {
        name: "lineWidth",
        desc: "线条粗细",
        dataType: "number",
        min: 1,
        max: 4
      },
      //  {'name':'plait_alpha', 'desc':'线条透明度','dataType':'alpha','min':1,'max':10,'default':5},
      {
        name: "bg",
        desc: "背景",
        dataType: "bg",
        options: [{
            type: "color",
            bg: "#00010b"
          },
          {
            type: "color",
            bg: "#051b44"
          },
          {
            type: "color",
            // bg: "linear-gradient(45deg, #051b44 0%, #4f3258 100%), linear-gradient(#00010b, #00010b))"
            bg: "linear-gradient(45deg, #051b44 0%, #4f3258 100%)"
          },
          {
            type: "img",
            bg: "url(./img/firstbgb.jpg)"
          },
          {
            type: "img",
            bg: "url(./img/firstbgc.jpg)"
          }
        ]
      }
    ]
  }
};