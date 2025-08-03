import topLevel from "topLevel.ts"
import availableNames from "availableNames.ts"

function getNode(info: string, recipients: string[]): Node {
	const object = MakeObjectFromAvailableNames(info, availableNames) // GPT
	const newNames = FindNewNames(object, availableNames)
	
	populateNewNames(newNames)
	
	return { 
		title: MakeDistinctTitle(info) // GPT, 
		description: MakePreciseDescription(info) // GPT, 
		object, 
		info, 
		recipients,
		id: SHA256(info) // to avoid duplication,
		summary:  MakeAtomicSummary(info) // GPT
	}
}

function noExtraSpace(text: string) {
	return text.replaceAll("\n", " ").replaceAll("\r", " ").replaceAll("\t", " ").replaceAll("   ", " ").replaceAll("  ", " ").replaceAll("  ", " ");
}

function segment(info: string, recipients: string[], searchNode: Node, newLevel: Level) {
	const text = noExtraSpace(toHTML(info).innerText)
	const node = text ? getNode(text, recipients) : searchNode
	const level = getTopLevel(newLevel ?? topLevel)
	const parentFromLevel = findParentFromLevel(level.nodes /\* based on descriptions and summaries \*/, node.description)
	
	if (parentFromLevel) {
		return segment("", node, parentFromLevel)
	}

	node.parentId = level.id;
	addToLevel(node, level)
	const grouping = findGrouping(level.nodes)
	rewireLevel({ ...grouping }, level) // grouping.nodes, grouping.description, grouping.summary, grouping.title and REWIRING the parentIds
	// re_SetLevel(topLevel)
}

function deleteNode(node) {
	nodeGone(node);
	deleteChildNodeFromParentList(node.parentId, node.id);
	
	if (topLevel.contains(node)) {
		re_SetLevel(topLevel);
	}
}

// command or api or cron or trigger for segment(info, recipients)