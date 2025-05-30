(async function() {
  // 1) MetaMask(web3) 연결
  if (typeof window.ethereum === "undefined") {
    document.getElementById("timeline").innerHTML = 
      "<p style='color:red'>MetaMask가 설치되어 있지 않습니다.</p>";
    return;
  }

  let provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();

  // 2) 컨트랙트 정보
  const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
  const contractABI = [{
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "trackingId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        }
      ],
      "name": "ComponentCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "trackingId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "ProcessStepAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "productId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "componentTrackingIds",
          "type": "uint256[]"
        }
      ],
      "name": "ProductCreated",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_trackingId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_description",
          "type": "string"
        }
      ],
      "name": "addProcessStep",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "componentCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "components",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "trackingId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "origin",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "details",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_origin",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_details",
          "type": "string"
        },
        {
          "internalType": "string[]",
          "name": "_processDescriptions",
          "type": "string[]"
        }
      ],
      "name": "createComponent",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "uint256[]",
          "name": "_componentTrackingIds",
          "type": "uint256[]"
        }
      ],
      "name": "createProduct",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_trackingId",
          "type": "uint256"
        }
      ],
      "name": "getComponent",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "trackingId",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "origin",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "details",
              "type": "string"
            },
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "timestamp",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "description",
                  "type": "string"
                }
              ],
              "internalType": "struct Traceability.ProcessStep[]",
              "name": "processSteps",
              "type": "tuple[]"
            }
          ],
          "internalType": "struct Traceability.Component",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_trackingId",
          "type": "uint256"
        }
      ],
      "name": "getProcessSteps",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            }
          ],
          "internalType": "struct Traceability.ProcessStep[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_productId",
          "type": "uint256"
        }
      ],
      "name": "getProduct",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "productId",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "uint256[]",
              "name": "componentTrackingIds",
              "type": "uint256[]"
            }
          ],
          "internalType": "struct Traceability.Product",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_trackingId",
          "type": "uint256"
        }
      ],
      "name": "getProductsByComponent",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "globalId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "productCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "products",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "productId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "productsByComponent",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }];

  const contract = new ethers.Contract(contractAddress, contractABI, signer);

  // 3) 사용자 입력
  const inputId = prompt("조회할 트래킹 ID 또는 제품 ID를 입력하세요");
  const parsedId = parseInt(inputId);

  if (isNaN(parsedId)) {
    document.getElementById("timeline").innerHTML = 
      "<p>유효한 숫자가 아닙니다.</p>";
    return;
  }

  // 그룹 및 아이템 준비
  let groups = new vis.DataSet();
  let groupMap = {};
  let groupIdCounter = 1;

  function getGroupId(compName) {
    if (!groupMap[compName]) {
      groupMap[compName] = groupIdCounter;
      groups.add({ id: groupIdCounter, content: compName });
      groupIdCounter++;
    }
    return groupMap[compName];
  }

  let itemsArray = [];

  try {
    // 제품 기준 조회
    let productData = await contract.getProduct(parsedId);
    const componentIds = productData.componentTrackingIds || productData[2];

    for (let compId of componentIds) {
      try {
        let compData = await contract.getComponent(compId);
        const compName = compData.name || compData[1];
        const processSteps = compData.processSteps || compData[4];
        const gId = getGroupId(compName);

        processSteps.forEach((step, index) => {
          const dateObj = new Date(step.timestamp * 1000);
          itemsArray.push({
            id: `${compId}-${index}`,
            group: gId,
            start: dateObj,
            type: 'point',
            title: step.description,
            content: ''
          });
        });
      } catch (err) {
        console.error(`부속품 ${compId} 조회 실패: `, err);
      }
    }
  } catch (productError) {
    // 부속품 단독 조회
    try {
      let compData = await contract.getComponent(parsedId);
      const compName = compData.name || compData[1];
      const processSteps = compData.processSteps || compData[4];
      const gId = getGroupId(compName);

      processSteps.forEach((step, index) => {
        const dateObj = new Date(step.timestamp * 1000);
        itemsArray.push({
          id: `${parsedId}-${index}`,
          group: gId,
          start: dateObj,
          type: 'point',
          title: step.description,
          content: ''
        });
      });
    } catch (err) {
      console.error("getComponent 호출 실패:", err);
      document.getElementById("timeline").innerHTML =
        "<p>입력한 트래킹 ID의 정보를 가져올 수 없습니다.</p>";
      return;
    }
  }

  // 정보가 없을 경우
  if (itemsArray.length === 0) {
    document.getElementById("timeline").innerHTML =
      "<p>해당 ID에 대한 공정 단계 정보가 없습니다.</p>";
    return;
  }

  // 6) vis-timeline 표시
  const timelineItems = new vis.DataSet(itemsArray);

  const options = {
    orientation: { axis: 'top' },
    stack: false,
    width: '100%',
    height: '500px',
    zoomable: true,
    margin: { item: 20 },
    format: {
      minorLabels: {
        millisecond:'HH:mm:ss',
        second:     'HH:mm:ss',
        minute:     'HH:mm',
        hour:       'MMM D HH:mm',
        weekday:    'MMM D',
        day:        'MMM D',
        month:      'YYYY MMM',
        year:       'YYYY'
      },
      majorLabels: {
        millisecond:'MMM D',
        second:     'MMM D',
        minute:     'MMM D',
        hour:       'MMM D YYYY',
        weekday:    'MMM D YYYY',
        day:        'MMM YYYY',
        month:      'YYYY',
        year:       ''
      }
    }
  };

  const container = document.getElementById("timeline");
  new vis.Timeline(container, timelineItems, groups, options);
})();
