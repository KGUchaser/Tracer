document.addEventListener("DOMContentLoaded", async function () {
  const form = document.querySelector("form");

  if (!window.ethereum) {
    alert("MetaMask를 설치해주세요.");
    return;
  }

  // const provider = new ethers.providers.JsonRpcProvider(
  //   "http://localhost:8545/"
  // );
  // const privateKey =
  //   "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  // const signer = new ethers.Wallet(privateKey, provider);

  // ✅ 관리자 인증 로직 제거
  await window.ethereum.request({ method: "eth_requestAccounts" });
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const contractAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"; // 배포한 스마트컨트랙트 주소
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

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const componentName = form.querySelector("#componentName").value;
    const origin = form.querySelector("input").value;
    const details = form.querySelector("textarea").value;
    const steps = [...form.querySelectorAll(".step")]
      .map((el) => el.value)
      .filter(Boolean);

    if (!origin || !details || steps.length === 0) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    try {
      console.log("📤 createComponent 트랜잭션 전송 중...");
      const tx = await contract.createComponent(
        componentName,
        origin,
        details,
        steps
      );
      const receipt = await tx.wait();
      console.log("📦 receipt:", receipt);

      const args = getEventArgs(receipt, "ComponentCreated", contractABI);
      console.log("📌 이벤트 결과:", args);

      const trackingId = args?.trackingId?.toString();
      console.log("✅ trackingId:", trackingId);

      if (!trackingId) {
        alert("등록 실패 (이벤트 수신 실패)");
        return;
      }

      // if (steps.length > 0) {
      //   const stepTx = await contract.addProcessStep(trackingId, steps[0]);
      //   await stepTx.wait();
      // }

      const savedSteps = await contract.getProcessSteps(trackingId);
      console.log("savedSteps:");
      console.log(savedSteps);

      try {
        await navigator.clipboard.writeText(trackingId);
        alert(
          `${componentName} 등록 완료!\n부속품 ID: ${trackingId} (클립보드에 복사됨)`
        );
      } catch {
        alert(` ${componentName} 등록 완료!\n부속품 ID: ${trackingId}`);
      }

      form.reset();

      setTimeout(() => {
        window.location.href = "/frontend/templates/index.html";
      }, 2000);
      // window.location.href = "/Tracer/frontend/templates/index.html";
    } catch (err) {
      console.error("❌ 등록 중 오류 발생:", err);
      alert("트랜잭션 처리 중 오류가 발생했습니다.");
    }
  });
});

// 🔹 이벤트 파싱 함수
function getEventArgs(receipt, eventName, abi) {
  const iface = new ethers.utils.Interface(abi);
  for (const log of receipt.logs) {
    try {
      const parsed = iface.parseLog(log);
      if (parsed.name === eventName) return parsed.args;
    } catch (e) {
      continue;
    }
  }
  return null;
}

async function checkAdminAccess() {
  if (!window.ethereum) {
    alert("MetaMask가 필요합니다.");
    window.location.href = "../index.html";
    return;
  }

  try {
    console.log("📝 MetaMask 연결 요청...");
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    console.log("📝 ethers provider 준비...");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    console.log("📝 주소 가져오기...");
    const userAddress = (await signer.getAddress())?.toLowerCase();
    console.log(`📝 현재 주소: ${userAddress}`);

    if (!userAddress) {
      alert("메타마스크 주소 가져오기 실패.");
      window.location.href = "../index.html";
      return;
    }

    console.log("📝 관리자 목록 로드 중...");
    const res = await fetch("../../data/adminWallets.json");
    if (!res.ok) {
      throw new Error(`adminWallets.json 로드 실패: ${res.status}`);
    }
    const wallets = await res.json();
    const adminAddrs = wallets.map(w => w.address.toLowerCase());
    console.log("📝 관리자 주소 목록:", adminAddrs);

    if (!adminAddrs.includes(userAddress)) {
      alert("관리자 권한이 없습니다. 접근이 차단됩니다.");
      setTimeout(() => {
        window.location.href = "../index.html";
      }, 3000);  // 3초 후 이동
    } else {
      console.log("✅ 관리자 권한 확인 완료");
    }

  } catch (err) {
    console.error("❌ checkAdminAccess 에러 발생:", err);
    alert("메타마스크 연결 실패 또는 관리자 확인 실패. 콘솔을 확인하세요.");
    window.location.href = "../index.html";
  }
}


// 페이지 로드시 실행
checkAdminAccess();
