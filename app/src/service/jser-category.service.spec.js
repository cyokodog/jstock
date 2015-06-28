describe('jserCategoryService.get', function(){
    beforeEach(module('app'));
    function test(plugins_qty, jq_flg, result){
        return function(jserCategoryService){
          expect(
            jserCategoryService.get(
              plugins_qty,
              jq_flg
            )
          ).
          toEqual(
            result
          );
        }
    }
    it('japanese creator になること', 
        inject(test(1,1,{type: 'japanese-creator', name: 'Japanese Creator'}))
    )
    it('japanese reviewer になること', 
        inject(test(0,1,{type: 'japanese-reviewer', name: 'Japanese Reviewer'}))
    )
    it('creator になること', 
        inject(test(1,0,{type: 'creator', name: 'Creator'}))
    )
    it('空のオブジェクトになること', 
        inject(test(0,0,{}))
    )
})