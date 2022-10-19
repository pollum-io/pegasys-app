import { Flex, ButtonProps } from "@chakra-ui/react";
import React from "react";
import {
	Paginator,
	Container,
	Previous,
	Next,
	PageGroup,
} from "chakra-paginator";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import { usePicasso } from "hooks";

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

	const theme = usePicasso();

	const normalStyles: ButtonProps = {
		bg: "transparent",
		color: theme.text.lightGray,
		_hover: { opacity: "0.9" },
		fontSize: "14px",
		fontWeight: "400",
	};

	const activeStyles: ButtonProps = {
		color: theme.text.cyanPurple,
		bg: "transparent",
		_hover: { opacity: "0.9" },
		fontSize: "14px",
		fontWeight: "600",
	};

	return (
		<Flex justifyContent="center">
			{quantityOfPages > 1 && (
				// eslint-disable-next-line
				// @ts-ignore
				<Paginator
					activeStyles={activeStyles}
					normalStyles={normalStyles}
					pagesQuantity={quantityOfPages}
					currentPage={currentPage}
					onPageChange={handlePageChange}
				>
					<Container align="center" justify="space-between" p="5">
						<Previous
							borderRadius="full"
							bgColor={theme.bg.blueLightPurple}
							px="1"
							py="1"
							border="none"
							_hover={
								currentPage === 1
									? { opacity: "0.3" }
									: { bgColor: theme.bg.bluePurple }
							}
						>
							<MdArrowBack color={theme.text.cyan} size={20} />
						</Previous>
						<PageGroup mr="1rem" ml="1rem" isInline align="center" />
						<Next
							borderRadius="full"
							bgColor={theme.bg.blueLightPurple}
							px="1"
							py="1"
							_hover={
								currentPage === quantityOfPages
									? { opacity: "0.3" }
									: { bgColor: theme.bg.bluePurple }
							}
						>
							<MdArrowForward color={theme.text.cyan} size={20} />
						</Next>
					</Container>
				</Paginator>
			)}
		</Flex>
	);
};
