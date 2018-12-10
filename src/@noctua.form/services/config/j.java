





JSONObject analysisCorrections = new JSONObject()      
                .put('fdr', new JSONObject()
                      .put("id", "fdr")
                      .put("label", "False Discovery Rate")
                      .put("description", "Choose this bla bla")};
                .put('bonferroni', new JSONObject()
                      .put("id", "bonferroni")
                      .put("label", "Bonferroni")
                      .put("description", "Choose this bla bla")};
                .put('none', new JSONObject()
                      .put("id", "none")
                      .put("label", "No Correction")
                      .put("description", "No Correction")};


public class ListItem {        
    public String id;
    public String label;        
    public String description;     

    public ListItem(String id, String label, String description) {
        this.id = id;
        this.label = label;
        // etc
    }
}

public List<String> analysisCorrection = new  ()s;

private generateConstant(String configData) [
    JSONObject obj = new JSONObject(configData);
     this.analysisCorrections = new ArrayList<String>();
    JSONArray array = obj.getJSONArray("analysisCorrections");

    for(int i = 0 ; i < array.length() ; i++){
        analysisCorrections.add(new ListItem(
        array.getJSONObject(i).getString("id"),
        array.getJSONObject(i).getString("label"));,
        array.getJSONObject(i).getString("description"));
    } 
}

/** @api = "over"
options: this.analysisCo()
 */
public overrep(String selectedAnalysisCorrection) {
    if (selectedAnalysisCorrection ==  analysisCorrections.fdr.id) {
    //do FRD
    } else if(electedAnalysisCorrection ==  analysisCorrections.bonferroni.id) 

    else ()
}


