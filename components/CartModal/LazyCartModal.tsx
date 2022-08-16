import dynamic from "next/dynamic";

const LazyCartModel = dynamic(() => import("./CartModal"));

export default LazyCartModel;
