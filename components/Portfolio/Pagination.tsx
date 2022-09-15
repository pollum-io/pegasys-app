import { Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import {
	Paginator,
	Container,
	Previous,
	Next,
	PageGroup,
} from "chakra-paginator";

interface IPaginationComponent {
	quantityOfPages: number;
	currentPage: number;
	setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export const PaginationComponent: React.FunctionComponent<
	IPaginationComponent
> = props => {
	const { quantityOfPages, currentPage, setCurrentPage } = props;

	const handlePageChange = (nextPage: number) => {
		setCurrentPage(nextPage);
	};

	return (
		<Paginator
			pagesQuantity={quantityOfPages}
			currentPage={currentPage}
			onPageChange={handlePageChange}
		>
			<Container align="center" justify="space-between" w="full" p={4}>
				<Previous>
					Previous
					{/* Or an icon from `react-icons` */}
				</Previous>
				<PageGroup isInline align="center" />
				<Next>
					Next
					{/* Or an icon from `react-icons` */}
				</Next>
			</Container>
		</Paginator>
	);
};
