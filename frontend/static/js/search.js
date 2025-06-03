// const { ethers } = require("hardhat");

document.addEventListener("DOMContentLoaded", async function () {

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual"; // 스크롤 위치 복원 방지
  }

  const btnSearchInfo = document.getElementById("btnSearchInfo");
  const resultSection = document.getElementById("resultSection");
  const trackingIdInput = document.getElementById("trackingId");
  const btnTimeline = document.getElementById("btnTimeline");

  const savedInput = sessionStorage.getItem("lastSearchInput");
  const savedResult = sessionStorage.getItem("lastSearchResult");
  const savedScrollY = sessionStorage.getItem("lastScrollY");

  async function scrollToTimelineBtn(retry = 0) {
    const btn = document.getElementById("btnTimeline");
    if (btn && btn.offsetParent !== null) {
      btn.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest"
      });
      sessionStorage.removeItem("lastScrollY");
    } else if (retry < 10) {
      setTimeout(() => scrollToTimelineBtn(retry + 1), 100);
    }
  }

  if (savedInput) {
    trackingIdInput.value = savedInput;
    await displayResult(savedInput);
    drawTree(savedInput);
    if (savedScrollY) {
      await scrollToTimelineBtn();
    }
  } else {
    document.getElementById("treeSVG").classList.add("hidden");
  }
  // if (savedResult) {
  //   resultSection.innerHTML = savedResult;
  //   resultSection.classList.remove("hidden");
  //   btnTimeline.classList.remove("hidden");

  //   attachTimelineClick();
  // }
  if(savedScrollY) {
    setTimeout(() => {
      const btnTimeline = document.getElementById("btnTimeline");
      const resultBox = document.getElementById("resultSection");
      console.log("btnTimeline y=", btnTimeline.getBoundingClientRect().top + window.pageYOffset);
      console.log("resultBox y=", resultBox.getBoundingClientRect().top + window.pageYOffset);

      window.scrollTo({
        top: resultBox.getBoundingClientRect().top + window.pageYOffset - 20,
        left: 0,
        behavior: "smooth"
      });
    }, 400);
  }

  // 이더리움 provider 및 계약 연결
  // let provider = new ethers.providers.Web3Provider(window.ethereum);
  const provider = new ethers.providers.JsonRpcProvider(
    "http://localhost:8545/"
  );
  const privateKey =
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const signer = new ethers.Wallet(privateKey, provider);
  // await provider.send("eth_requestAccounts", []);
  // const signer = provider.getSigner();
  const contractAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"; // 실제 주소로 변경
  const contractABI = [
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "trackingId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "name",
          type: "string",
        },
      ],
      name: "ComponentCreated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "trackingId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "description",
          type: "string",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "timestamp",
          type: "uint256",
        },
      ],
      name: "ProcessStepAdded",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "productId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "name",
          type: "string",
        },
        {
          indexed: false,
          internalType: "uint256[]",
          name: "componentTrackingIds",
          type: "uint256[]",
        },
      ],
      name: "ProductCreated",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_trackingId",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "_description",
          type: "string",
        },
      ],
      name: "addProcessStep",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "componentCount",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "components",
      outputs: [
        {
          internalType: "uint256",
          name: "trackingId",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "name",
          type: "string",
        },
        {
          internalType: "string",
          name: "origin",
          type: "string",
        },
        {
          internalType: "string",
          name: "details",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_name",
          type: "string",
        },
        {
          internalType: "string",
          name: "_origin",
          type: "string",
        },
        {
          internalType: "string",
          name: "_details",
          type: "string",
        },
        {
          internalType: "string[]",
          name: "_processDescriptions",
          type: "string[]",
        },
      ],
      name: "createComponent",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_name",
          type: "string",
        },
        {
          internalType: "uint256[]",
          name: "_componentTrackingIds",
          type: "uint256[]",
        },
      ],
      name: "createProduct",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_trackingId",
          type: "uint256",
        },
      ],
      name: "getComponent",
      outputs: [
        {
          components: [
            {
              internalType: "uint256",
              name: "trackingId",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              internalType: "string",
              name: "origin",
              type: "string",
            },
            {
              internalType: "string",
              name: "details",
              type: "string",
            },
            {
              components: [
                {
                  internalType: "uint256",
                  name: "timestamp",
                  type: "uint256",
                },
                {
                  internalType: "string",
                  name: "description",
                  type: "string",
                },
              ],
              internalType: "struct Traceability.ProcessStep[]",
              name: "processSteps",
              type: "tuple[]",
            },
          ],
          internalType: "struct Traceability.Component",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_trackingId",
          type: "uint256",
        },
      ],
      name: "getProcessSteps",
      outputs: [
        {
          components: [
            {
              internalType: "uint256",
              name: "timestamp",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "description",
              type: "string",
            },
          ],
          internalType: "struct Traceability.ProcessStep[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_productId",
          type: "uint256",
        },
      ],
      name: "getProduct",
      outputs: [
        {
          components: [
            {
              internalType: "uint256",
              name: "productId",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              internalType: "uint256[]",
              name: "componentTrackingIds",
              type: "uint256[]",
            },
          ],
          internalType: "struct Traceability.Product",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_trackingId",
          type: "uint256",
        },
      ],
      name: "getProductsByComponent",
      outputs: [
        {
          internalType: "uint256[]",
          name: "",
          type: "uint256[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "globalId",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "productCount",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "products",
      outputs: [
        {
          internalType: "uint256",
          name: "productId",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "name",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "productsByComponent",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];
  const contract = new ethers.Contract(contractAddress, contractABI, signer);

  function drawTree(trackingId) {
    if (typeof generateTree === "function") {
      window.generateTree(trackingId)
    }
  }

  btnSearchInfo.addEventListener("click", async function () {
    const input = trackingIdInput.value.trim();
    if (!input) {
      alert("트래킹 ID를 입력하세요.");
      sessionStorage.removeItem("lastSearchInput");
      resultSection.innerHTML = "";
      resultSection.classList.add("hidden");
      btnTimeline.classList.add("hidden");

      document.getElementById("treeSVG").classList.add("hidden");
      return;
    }
    sessionStorage.setItem("lastSearchInput", input);
    await displayResult(input);
    drawTree(input);
  });

  btnTimeline.addEventListener("click", function () {
    const trackingId = trackingIdInput.value.trim();
    if (!trackingId) {
      alert("트래킹 ID를 입력하세요.");
      return;
    }
    sessionStorage.setItem("lastScrollY", btnTimeline.getBoundingClientRect().top + window.pageYOffset - 20);
    sessionStorage.setItem("timelineTrackingId", trackingId);
    sessionStorage.setItem("backFromTimeline", "1");
    window.location.href = "timeline.html";
  });

  async function restoreLastResult() {
    const savedInput = sessionStorage.getItem("lastSearchInput");
    if (savedInput) {
      trackingIdInput.value = savedInput;
      await displayResult(savedInput, { suppressAlert: true });
      drawTree(savedInput);
    } else {
      document.getElementById("treeSVG").classList.add("hidden");
    }
  }

  async function displayResult(input, opts = {}) {
    resultSection.innerHTML = "";
    resultSection.classList.remove("hidden");
    btnTimeline.classList.add("hidden");
    let found = false;

    try {
      const productData = await contract.getProduct(input);
      renderProduct(productData);
      found = true;
    } catch {
      try {
        const compData = await contract.getComponent(input);
        await renderComponent(compData, input);
        found = true;
      } catch {
        if (!opts.suppressAlert) {
          // alert("트래킹 ID 정보 없음.");
        }
        resultSection.classList.add("hidden");
        btnTimeline.classList.add("hidden");
      }
    }
    if (found) {
      document.getElementById("treeSVG").classList.remove("hidden");
    } else {
      document.getElementById("treeSVG").classList.add("hidden");
    }
  }

  async function renderProduct(productData) {
    const prodId = productData.productId?.toString() ?? productData[0].toString();
    const productName = productData.name ?? productData[1];
    const componentIds = productData.componentTrackingIds ?? productData[2];

    resultSection.innerHTML = `<div class="gradient-box">
                                <div class="g-box-title">${productName}</div>
                                <div class="g-box-disc">(제품 ID: ${prodId})</div>
                                </div>`;

    let compList = document.createElement("div");
    for (const compId of componentIds) {
      try {
        const compData = await contract.getComponent(compId);
        compList.appendChild(renderComponentElement(compData, compId));
      } catch {
        let errorDiv = document.createElement("div");
        errorDiv.textContent = `부속품 ID ${compId} 조회 실패.`;
        compList.appendChild(errorDiv);
      }
    }
    resultSection.appendChild(compList);
    btnTimeline.style.display = "block";
  }

  async function renderComponent(compData, input) {
    resultSection.innerHTML = "";
    resultSection.appendChild(renderComponentElement(compData, input));

    try {
      const usedProductIds = await contract.getProductsByComponent(input);
      if (usedProductIds.length > 0) {
        let usedSection = document.createElement("div");
        usedSection.innerHTML = `<h4 class="white-capsule">이 부속품이 사용된 제품</h4>`;
        let ul = document.createElement("ul");
        for (const pId of usedProductIds) {
          try {
            const prodData = await contract.getProduct(pId);
            const pName = prodData.name ?? prodData[1];
            let li = document.createElement("li");
            li.textContent = `${pName} (제품 ID: ${pId})`;
            ul.appendChild(li);
          } catch {
            let li = document.createElement("li");
            li.textContent = `제품 ID: ${pId}`;
            ul.appendChild(li);
          }
        }
        usedSection.appendChild(ul);
        resultSection.appendChild(usedSection);
      } else {
        resultSection.innerHTML += `<p>이 부속품은 현재 등록된 제품에 사용되지 않았습니다.</p>`;
      }
    } catch {
      console.error("부속품 사용 제품 조회 오류");
    }
    btnTimeline.style.display = "block";

    resultSection.classList.remove("hidden");
    btnTimeline.classList.remove("hidden");
  }

  function renderComponentElement(compData, compId) {
    const compName = compData.name ?? compData[1];
    const origin = compData.origin ?? compData[2];
    const details = compData.details ?? compData[3];
    const processSteps = compData.processSteps ?? compData[4];

    let compDiv = document.createElement("div");
    compDiv.innerHTML = `<h2 class="gradient-text-light">${compName} (부속품 ID: ${compId})</h2>
                               <p><strong class="charcole-capsule">세부정보</strong> ${details}</p>
                               <p><strong class="charcole-capsule">원산지</strong> ${origin}</p>
                               <p><strong class="charcole-capsule">공정과정</strong></p>`;

    let stepsList = document.createElement("ul");
    if (processSteps.length > 0) {
      processSteps.forEach((step) => {
        const date = new Date(step.timestamp * 1000).toLocaleString();
        let li = document.createElement("li");
        li.textContent = `${date} - ${step.description}`;
        stepsList.appendChild(li);
      });
    } else {
      let li = document.createElement("li");
      li.textContent = "유통 과정 정보가 없습니다.";
      stepsList.appendChild(li);
    }
    compDiv.appendChild(stepsList);
    
    resultSection.classList.remove("hidden");
    btnTimeline.classList.remove("hidden");

    return compDiv;
  }

  await restoreLastResult();

  if (sessionStorage.getItem("backFromTimeline") === "1") {
    scrollToTimelineBtn();
    sessionStorage.removeItem("backFromTimeline");
  }
  
  // ★ 스크롤 이동 추가
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $("#upBtn").fadeIn();
    } else {
      $("#upBtn").fadeOut();
    }

    resultSection.classList.remove("hidden");
    btnTimeline.classList.remove("hidden");
  });

  $("#upBtn").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 400);
    
    resultSection.classList.remove("hidden");
    btnTimeline.classList.remove("hidden");

    return false;
  });
});
