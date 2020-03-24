import { companyId } from './api'
export const DOMAIN_LIST = [
  /* Default domains included */
  "aol.com", "att.net", "comcast.net", "facebook.com", "gmail.com", "gmx.com", "googlemail.com",
  "google.com", "hotmail.com", "hotmail.co.uk", "mac.com", "me.com", "mail.com", "msn.com",
  "live.com", "sbcglobal.net", "verizon.net", "yahoo.com", "yahoo.co.uk",

  /* Other global domains */
  "email.com", "fastmail.fm", "games.com" /* AOL */, "gmx.net", "hush.com", "hushmail.com", "icloud.com",
  "iname.com", "inbox.com", "lavabit.com", "love.com" /* AOL */, "outlook.com", "pobox.com", "protonmail.ch", "protonmail.com", "tutanota.de", "tutanota.com", "tutamail.com", "tuta.io",
 "keemail.me", "rocketmail.com" /* Yahoo */, "safe-mail.net", "wow.com" /* AOL */, "ygm.com" /* AOL */,
  "ymail.com" /* Yahoo */, "zoho.com", "yandex.com",

  /* United States ISP domains */
  "bellsouth.net", "charter.net", "cox.net", "earthlink.net", "juno.com",

  /* British ISP domains */
  "btinternet.com", "virginmedia.com", "blueyonder.co.uk", "freeserve.co.uk", "live.co.uk",
  "ntlworld.com", "o2.co.uk", "orange.net", "sky.com", "talktalk.co.uk", "tiscali.co.uk",
  "virgin.net", "wanadoo.co.uk", "bt.com",

  /* Domains used in Asia */
  "sina.com", "sina.cn", "qq.com", "naver.com", "hanmail.net", "daum.net", "nate.com", "yahoo.co.jp", "yahoo.co.kr", "yahoo.co.id", "yahoo.co.in", "yahoo.com.sg", "yahoo.com.ph", "163.com", "yeah.net", "126.com", "21cn.com", "aliyun.com", "foxmail.com",

  /* French ISP domains */
  "hotmail.fr", "live.fr", "laposte.net", "yahoo.fr", "wanadoo.fr", "orange.fr", "gmx.fr", "sfr.fr", "neuf.fr", "free.fr",

  /* German ISP domains */
  "gmx.de", "hotmail.de", "live.de", "online.de", "t-online.de" /* T-Mobile */, "web.de", "yahoo.de",

  /* Italian ISP domains */
  "libero.it", "virgilio.it", "hotmail.it", "aol.it", "tiscali.it", "alice.it", "live.it", "yahoo.it", "email.it", "tin.it", "poste.it", "teletu.it",

  /* Russian ISP domains */
  "mail.ru", "rambler.ru", "yandex.ru", "ya.ru", "list.ru",

  /* Belgian ISP domains */
  "hotmail.be", "live.be", "skynet.be", "voo.be", "tvcablenet.be", "telenet.be",

  /* Argentinian ISP domains */
  "hotmail.com.ar", "live.com.ar", "yahoo.com.ar", "fibertel.com.ar", "speedy.com.ar", "arnet.com.ar",

  /* Domains used in Mexico */
  "yahoo.com.mx", "live.com.mx", "hotmail.es", "hotmail.com.mx", "prodigy.net.mx",

  /* Domains used in Canada */
  "yahoo.ca", "hotmail.ca", "bell.net", "shaw.ca", "sympatico.ca", "rogers.com",

  /* Domains used in Brazil */
  "yahoo.com.br", "hotmail.com.br", "outlook.com.br", "uol.com.br", "bol.com.br", "terra.com.br", "ig.com.br", "itelefonica.com.br", "r7.com", "zipmail.com.br", "globo.com", "globomail.com", "oi.com.br"
]

// mark colors based upon level

export const levelColor = (level) => {
  let color = 'green darken-1'
  level = level ? level.toLowerCase() : 'low'
  switch (level) {
    case 'high':
      color = 'red darken-4'
      break
    case 'medium':
      color = 'red lighten-1'
      break
    case 'low':
      color = 'green darken-1'
      break
  }
  return color
}


export const validEmail = (email) => {
  const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return pattern.test(email)
}

// Pie chart 
const riskPieChart = (high, medium, low, title, high_label='High', medium_label='Medium', low_label="Low") => {
  return {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        height: '100%'
    },
    title: {
        text: title
    },
    tooltip: {
        pointFormat: '<b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
      announceNewData: {
            enabled: true
      },
      point: {
          valueSuffix: '%'
      }
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: false,
                format: '{point.y:.1f} %',
                distance: '-20%',
            },
            showInLegend: true,
            center: ['50%', '50%']
        },
    },
    series: [{
      name: '',
      colorByPoint: true,
      size: '90%',
      innerSize: '80%',
      data: [{
          name: high_label,
          y: parseFloat(high),
          sliced: true,
          selected: true,
          color: 'red',
          drilldown: "High"
      }, {
          name: medium_label,
          y: parseFloat(medium),
          color: 'orange',
          drilldown: "Medium"
      }, {
          name: low_label,
          y: parseFloat(low),
          color: 'green',
          drilldown: "Low"
      }]
    }]
  }
}

// Bar Chart
const barchart = (title, data) => {
  return {
    chart: {
        type: 'column'
    },
    title: {
        text: title
    },
    // subtitle: {
    //     text: companyId
    // },
    accessibility: {
        announceNewData: {
            enabled: true
        }
    },
    xAxis: {
        type: 'category'
    },
    yAxis: {
        min: 0,
        title: {
            text: '# of Users'
        },
        tickInterval: 1,
    },
    legend: {
      enabled: false,
    },
    tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
    },

    plotOptions: {
        series: {
            borderWidth: 0,
            dataLabels: {
                enabled: true,
                format: '{point.y}'
            }
        }
    },
    series: [
        {
          name: "",
          colorByPoint: true,
          data
        }
    ]
  }
}

export const riskLevelChart = (high, medium, low) => {
  return riskPieChart(high, medium, low, 'Risk Levels')
}

export const userRiskChart = (high, medium, low) => {
  return riskPieChart(high, medium, low, 'High Risk Users')
}

export const appRiskChart = (high, medium, low) => {
  return riskPieChart(high, medium, low, 'High Risk Apps')
}

export const CIAChart = (high, medium, low) => {
  return riskPieChart(high, medium, low, 'CIA', 'Confidetiality', 'Availability')
}

export const scoreDonutChart = (score) => {
  let label = 'High Risk';
  let color = 'red';
  switch (score) {
    case 4:
    case 5:
      label = 'High Risk';
      color = 'red';
      break;
    case 3:
      label = 'Medium Risk';
      color = 'orange';
      break;
    default:
      label = 'Low Risk';
      color = 'green';
      break;
  }
  return {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
        height: '100%'
    },
    title: {
      text: 'Org Score'
    },
    exporting: {
      enabled: false
    },
    credits: {
      enabled: false
    },
    tooltip: {
        pointFormat: '<b>{point.y}</b>'
    },
    plotOptions: {
        pie: {
            dataLabels: {
                enabled: true,
                distance: '-100%',
                y: -5,
                format: label,
                style: {
                    fontWeight: 'bold',
                    color: color,
                    fontSize: '14px'
                },
                filter: {
                    property: 'name',
                    operator: '===',
                    value: 'Score'
                },
            },
             borderWidth: 3
        },
        series: {
          animation: false
        }
    },
    series: [{
        type: 'pie',
        name: '',
        size: '70%',
        innerSize: '80%',
        data: [
            { name: 'Score', y: score, color: color },
            { name: '', y: 5-score, color: "#E6E6E6" },
        ]
    }]
  }
}

export const appUsersChart = (apps) => {
  let axis = []
  let topApps = apps.sort((a, b) => b.no_users - a.no_users )
  let title= 'Users for Applications'

  let data = []
  topApps.map(app => {
    if (Number(app.no_users) > 0) {
      axis.push(app.application_name)
      data.push({
        name: app.application_name,
        y: app.no_users,
        drilldown: null
      })
    }
  })

  return barchart(title, data)
}