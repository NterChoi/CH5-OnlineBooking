| 기능        | URL                       | Method | Request.body  | Response.body                                                                                       |
|---------------------|---------------------------|--------|---------------|-----------------------------------------------------------------------------------------------------|
|회원가입| /api/user/signup          |POST| { <br>  "id" : "test",  <br>  "password" : "test", <br>  "passwordCheck" : "test",  <br>  "name" : "test"  <br>   } |{ <br> "id" : "test", <br> "name" : "test"<br> } |
|로그인| /api/user/login           |POST|{ <br> "id" : "test", <br> "password" : "test" <br> } |{<br> "message" : "로그인 성공" <br> }|
|프로필 조회| /api/user/showProfile     |GET|    |{ <br> "nickname" : "test_nickname", <br> "point" : 1000000<br> }|
|공연 등록| /api/performance/register |POST|{ <br> "