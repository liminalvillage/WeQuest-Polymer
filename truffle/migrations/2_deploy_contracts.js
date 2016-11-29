module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.deploy(mortal);
  deployer.autolink();
  deployer.deploy(WeSource);
  deployer.deploy(WeQuest);
};
