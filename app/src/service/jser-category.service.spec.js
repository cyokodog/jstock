describe('jser-category.service.spec.js', function(){
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
    it('japanese creator test', 
        inject(test(1,1,{type: 'japanese-creator', name: 'Japanese Creator'}))
    )
    it('japanese reviewer test', 
        inject(test(0,1,{type: 'japanese-reviewer', name: 'Japanese Reviewer'}))
    )
    it('creator test', 
        inject(test(1,0,{type: 'creator', name: 'Creator'}))
    )
    it('other test', 
        inject(test(0,0,{}))
    )
})