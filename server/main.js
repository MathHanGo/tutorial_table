import { Meteor } from 'meteor/meteor';
import MongoClient from 'mongodb'

const dbName = 'hkexnew';
const collectionName = 'doi_records';
const uri = "mongodb+srv://hanjunyan_doi:jIV6c7F1lCA6S0Yh0@doi-v8ejd.mongodb.net/test?retryWrites=true";

Meteor.startup(() => {

});


Meteor.publish('query_name', function(selector){
    // this.changed('test', "_id");
    const self = this;

    if(selector == undefined){
        var today = new Date()
        var date = {'report_date':[today.getDate(), today.getMonth(), today.getFullYear()].join('/')};
    }else{
        var date = selector;
    }

    MongoClient.connect(uri, {useNewUrlParser: true}, function (err, client) {
        if (err) throw err;
        var db = client.db(dbName);
        db.collection("test").find(date).toArray(function (err, result) {
            if (err) throw err;
            for (i = 0; i < result.length; i++) {
                self.added('records', result[i]['serial_number'], result[i]);
                if(Math.abs(result[i]['changes_event']) <= 0.001) {
                    var changes_event_string = '-'
                }else{
                    var changes_event_string = (Math.round(result[i]['changes_event']*100)/100) + '%';
                }
                if(Math.abs(result[i]['changes_1month']) <= 0.001){
                    var changes_1month_string = '-'
                }else{
                    var changes_1month_string = (Math.round(result[i]['changes_1month']*100)/100) + '%';
                }
                var date = result[i]['event_date'];
                var event_date_string = [date.getDate(), date.getMonth()+1, date.getFullYear()].join('/');

                self.added('records', result[i]['serial_number'], {'changes_event_string': changes_event_string, 'changes_1month_string':changes_1month_string,
                    'event_date_string':event_date_string});
            }
            return result
        });
    });
});
