import { Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import { Table } from "react-chakra-pagination";

interface IPaginationComponent {
	componentData: any;
}

export const PaginationComponent: React.FunctionComponent<
	IPaginationComponent
> = props => {
	const [currentPage, setCurrentPage] = useState<number>(1);
	const { componentData } = props;

	if (!componentData) return null;

	const tableData = [];

	const tableHeader = [];

	return <h1>Hello</h1>;
};
