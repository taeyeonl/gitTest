public class MainPage {
    @AuraEnabled
    public static String rightPanelContent { get; set; }

    @AuraEnabled
    public static String getButtonContent(String buttonValue) {
        // 根据按钮值返回相应的内容
        if (buttonValue.equals('button1')) {
            rightPanelContent = '按钮1的内容';
        } else if (buttonValue.equals('button2')) {
            rightPanelContent = '按钮2的内容';
        } else if (buttonValue.equals('button3')) {
            rightPanelContent = '按钮3的内容';
        } else if (buttonValue.equals('button4')) {
            rightPanelContent = '按钮4的内容';
        }
        // 添加更多按钮值的处理逻辑
        
        return rightPanelContent;
    }
    @AuraEnabled
	public static List<Knowledge__kav> getSearchList(String pathName, String searchTerm){
		System.debug('pathName-->>>>>>>>>:' + pathName);
		System.debug('searchTerm-->>>>>>>>>:' + searchTerm);
        if(pathName =='KYC'){
            System.debug('システムKYC-->>>>>>>>>:' + pathName);
        }
		System.debug('URL->>>>>>>>>:' + URL.getCurrentRequestUrl().toExternalForm());
        // 検索語をチェックする
        if (String.isBlank(searchTerm)) {
            System.debug('Title is blank. No further processing.');
            return null; 
        }
		List<Knowledge__kav> ankenList2 = new List<Knowledge__kav>();
		// 検索条件の生成
        // SQLインジェクション攻撃の防御
        searchTerm = '\'%' + String.escapeSingleQuotes(searchTerm) + '%\'';
        // String query = 'SELECT Id, Title, ArticleNumber, LastModifiedDate FROM Knowledge__kav WHERE Title LIKE '+ searchTerm + 'AND PublishStatus = \'Online\'';
        // System.debug('Executing SOQL query: ' + query);
        String query = 'SELECT Id, Title, ArticleNumber, LastModifiedDate FROM Knowledge__kav ';
        System.debug('Executing SOQL query: ' + query);
        List<Knowledge__kav> knowledgeList = Database.query(query);
        System.debug('Retrieved Knowledge Records: ' + knowledgeList);

        if( !knowledgeList.isEmpty() && pathName =='K1YC'){
            query = 'SELECT Id, ParentId, DataCategoryGroupName, DataCategoryName FROM Knowledge__DataCategorySelection';
            List<Knowledge__DataCategorySelection> dataCategoryList = Database.query(query);
            // 存储匹配的 Knowledge__kav 对象
            List<Knowledge__kav> matchingKnowledgeList = new List<Knowledge__kav>();

            // 创建一个 Set 存储 ParentId，以便快速查找
            Set<Id> parentIdsSet = new Set<Id>();
            for (Knowledge__DataCategorySelection dataCategory : dataCategoryList) {
                parentIdsSet.add(dataCategory.ParentId);
            }

            // 检查 Knowledge__kav 对象的 Id 是否匹配 ParentId
            for (Knowledge__kav knowledge : knowledgeList) {
                if (parentIdsSet.contains(knowledge.Id)) {
                    matchingKnowledgeList.add(knowledge);
                }
            }

            // 返回匹配的 Knowledge__kav 对象列表
            return matchingKnowledgeList;
        }
        return knowledgeList;
	}
}