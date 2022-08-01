const ChainSelectorButton = ({ name, switchNetwork, chainId, selectedChainId, logo }) => {
    return (
        <button
            className={
                "flex flex-row justify-between bg-[#edeef2] text-left w-[384px] py-4 px-4 rounded-xl font-medium" +
                (selectedChainId === chainId
                    ? " border-[3px] border-[#E84142]"
                    : " border border-[#c7cad4]")
            }
            onClick={() => switchNetwork(chainId)}
        >
            {name}
            <img className="flex items-center w-[30px]" src={logo}></img>
        </button>
    )
}

export default ChainSelectorButton;