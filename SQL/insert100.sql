insert into user(email,fullname,password) values ("abc@gmail.com","abcdefg",123);
insert into post(authorname,fk_author_id) values("abcdefg",(select user_id from user where fullname="abcdefg"));
insert into comment(authorname,fk_author_id,parent_comment) values("abcdefg",(select user_id from user where fullname="abcdefg"),2);
insert into friends(password,fullname,email,flag) values ("456","hijklmn","hijk@yahoo.com",1);
insert into likes(fk_user_id,fk_post_id,fk_comment_id) values ((select user_id from user where fullname="abcdefg"),(select post_id from post where authorname="abcdefg"),(select comment_id from comment where authorname="abcdefg"));